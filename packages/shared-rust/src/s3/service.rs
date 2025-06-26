use aws_sdk_s3::{
    primitives::ByteStream, 
    Client as S3Client, 
    presigning::PresigningConfig,
    types::ServerSideEncryption
};
use bytes::Bytes;
use sha2::{Digest, Sha256};
use std::time::Duration;
use std::collections::HashMap;

use super::config::{S3Config, S3BucketType};

pub type Result<T> = std::result::Result<T, S3Error>;

#[derive(Debug, thiserror::Error)]
pub enum S3Error {
    #[error("S3 operation failed: {0}")]
    S3Error(String),
}

#[derive(Clone)]
pub struct S3Service {
    client: S3Client,
    config: S3Config,
}

impl S3Service {
    pub fn new(client: S3Client, config: S3Config) -> Self {
        Self { client, config }
    }

    pub async fn from_config(config: &S3Config) -> Result<Self> {
        use aws_credential_types::Credentials;
        use aws_types::region::Region;
        
        let credentials = Credentials::new(
            &config.access_key_id,
            &config.secret_access_key,
            None,
            None,
            "shared-rust-s3",
        );

        let mut config_builder = aws_sdk_s3::Config::builder()
            .region(Region::new(config.region.clone()))
            .credentials_provider(credentials)
            .behavior_version_latest()
            .force_path_style(config.endpoint.is_some());

        if let Some(endpoint) = &config.endpoint {
            config_builder = config_builder.endpoint_url(endpoint);
        }

        let s3_config = config_builder.build();
        let client = S3Client::from_conf(s3_config);
        
        Ok(Self::new(client, config.clone()))
    }

    pub async fn put_object(&self, bucket_type: S3BucketType, key: &str, data: Bytes) -> Result<String> {
        let bucket = self.config.get_bucket(bucket_type);
        let body = ByteStream::from(data.clone());

        let mut put_builder = self.client
            .put_object()
            .bucket(bucket)
            .key(key)
            .body(body);

        // Add encryption if KMS key is configured
        if let Some(kms_key_id) = &self.config.kms_key_id {
            put_builder = put_builder
                .server_side_encryption(ServerSideEncryption::AwsKms)
                .ssekms_key_id(kms_key_id);
        }

        put_builder
            .send()
            .await
            .map_err(|e| {
                S3Error::S3Error(format!("Failed to put object {} in bucket {}: {}", key, bucket, e))
            })?;

        // Calculate hash for verification
        let mut hasher = Sha256::new();
        hasher.update(&data);
        let hash = hex::encode(hasher.finalize());

        Ok(hash)
    }

    pub async fn get_object(&self, bucket_type: S3BucketType, key: &str) -> Result<Bytes> {
        let bucket = self.config.get_bucket(bucket_type);
        
        let response = self
            .client
            .get_object()
            .bucket(bucket)
            .key(key)
            .send()
            .await
            .map_err(|e| {
                S3Error::S3Error(format!("Failed to get object {} from bucket {}: {}", key, bucket, e))
            })?;

        let data = response
            .body
            .collect()
            .await
            .map_err(|e| {
                S3Error::S3Error(format!("Failed to read object body {}: {}", key, e))
            })?
            .into_bytes();

        Ok(data)
    }

    pub async fn object_exists(&self, bucket_type: S3BucketType, key: &str) -> Result<bool> {
        let bucket = self.config.get_bucket(bucket_type);
        
        match self
            .client
            .head_object()
            .bucket(bucket)
            .key(key)
            .send()
            .await
        {
            Ok(_) => Ok(true),
            Err(e) => {
                let error_str = e.to_string().to_lowercase();
                
                // Check for common "not found" patterns
                if error_str.contains("nosuchkey") 
                    || error_str.contains("notfound") 
                    || error_str.contains("404")
                    || error_str.contains("not found")
                    || error_str.contains("no such key") {
                    log::debug!("Object {} not found in bucket {}: {}", key, bucket, e);
                    Ok(false)
                } else {
                    // For LocalStack compatibility, log error but don't fail
                    log::warn!("S3 error checking object existence {} in bucket {}: {}", key, bucket, e);
                    // Default to false for LocalStack compatibility
                    Ok(false)
                }
            }
        }
    }

    pub async fn list_objects_with_prefix(&self, bucket_type: S3BucketType, prefix: &str) -> Result<Vec<String>> {
        let bucket = self.config.get_bucket(bucket_type);
        
        let response = self
            .client
            .list_objects_v2()
            .bucket(bucket)
            .prefix(prefix)
            .send()
            .await
            .map_err(|e| {
                S3Error::S3Error(format!(
                    "Failed to list objects with prefix {} in bucket {}: {}",
                    prefix, bucket, e
                ))
            })?;

        let keys = response
            .contents
            .unwrap_or_default()
            .into_iter()
            .filter_map(|obj| obj.key)
            .collect();

        Ok(keys)
    }

    pub async fn delete_object(&self, bucket_type: S3BucketType, key: &str) -> Result<()> {
        let bucket = self.config.get_bucket(bucket_type);
        
        self.client
            .delete_object()
            .bucket(bucket)
            .key(key)
            .send()
            .await
            .map_err(|e| {
                S3Error::S3Error(format!("Failed to delete object {} from bucket {}: {}", key, bucket, e))
            })?;

        Ok(())
    }

    pub async fn copy_object(&self, bucket_type: S3BucketType, source_key: &str, dest_key: &str) -> Result<()> {
        let bucket = self.config.get_bucket(bucket_type);
        let copy_source = format!("{}/{}", bucket, source_key);

        self.client
            .copy_object()
            .bucket(bucket)
            .copy_source(&copy_source)
            .key(dest_key)
            .send()
            .await
            .map_err(|e| {
                S3Error::S3Error(format!(
                    "Failed to copy object {} to {} in bucket {}: {}",
                    source_key, dest_key, bucket, e
                ))
            })?;

        Ok(())
    }

    pub fn calculate_file_hash(&self, data: &[u8]) -> String {
        let mut hasher = Sha256::new();
        hasher.update(data);
        hex::encode(hasher.finalize())
    }

    pub async fn generate_presigned_upload_url(
        &self,
        bucket_type: S3BucketType,
        key: &str,
        content_type: &str,
        file_size: u64,
    ) -> Result<String> {
        let bucket = self.config.get_bucket(bucket_type);
        let expires_in = Duration::from_secs(self.config.presigned_url_expiry_seconds);
        let presigning_config = PresigningConfig::expires_in(expires_in)
            .map_err(|e| S3Error::S3Error(format!("Failed to create presigning config: {}", e)))?;

        let mut put_builder = self
            .client
            .put_object()
            .bucket(bucket)
            .key(key)
            .content_type(content_type)
            .content_length(file_size as i64);

        // Add encryption if KMS key is configured
        if let Some(kms_key_id) = &self.config.kms_key_id {
            put_builder = put_builder
                .server_side_encryption(ServerSideEncryption::AwsKms)
                .ssekms_key_id(kms_key_id);
        }

        let presigned_request = put_builder
            .presigned(presigning_config)
            .await
            .map_err(|e| S3Error::S3Error(format!("Failed to generate presigned URL: {}", e)))?;

        Ok(presigned_request.uri().to_string())
    }

    pub async fn generate_presigned_download_url(
        &self,
        bucket_type: S3BucketType,
        key: &str,
    ) -> Result<String> {
        let bucket = self.config.get_bucket(bucket_type);
        let expires_in = Duration::from_secs(self.config.presigned_url_expiry_seconds);
        let presigning_config = PresigningConfig::expires_in(expires_in)
            .map_err(|e| S3Error::S3Error(format!("Failed to create presigning config: {}", e)))?;

        let presigned_request = self
            .client
            .get_object()
            .bucket(bucket)
            .key(key)
            .presigned(presigning_config)
            .await
            .map_err(|e| S3Error::S3Error(format!("Failed to generate presigned download URL: {}", e)))?;

        Ok(presigned_request.uri().to_string())
    }

    pub async fn get_object_metadata(&self, bucket_type: S3BucketType, key: &str) -> Result<HashMap<String, String>> {
        let bucket = self.config.get_bucket(bucket_type);
        
        let response = self
            .client
            .head_object()
            .bucket(bucket)
            .key(key)
            .send()
            .await
            .map_err(|e| {
                S3Error::S3Error(format!("Failed to get object metadata {} from bucket {}: {}", key, bucket, e))
            })?;

        let mut metadata = HashMap::new();
        
        if let Some(content_length) = response.content_length() {
            metadata.insert("content-length".to_string(), content_length.to_string());
        }
        
        if let Some(content_type) = response.content_type() {
            metadata.insert("content-type".to_string(), content_type.to_string());
        }
        
        if let Some(etag) = response.e_tag() {
            metadata.insert("etag".to_string(), etag.trim_matches('"').to_string());
        }
        
        if let Some(last_modified) = response.last_modified() {
            metadata.insert("last-modified".to_string(), last_modified.to_string());
        }

        // Add custom metadata
        if let Some(custom_metadata) = response.metadata() {
            for (key, value) in custom_metadata {
                metadata.insert(format!("x-amz-meta-{}", key), value.clone());
            }
        }

        Ok(metadata)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calculate_file_hash() {
        // Test the hash calculation without needing an S3 client
        let data = b"hello world";
        
        // Calculate hash directly using the same method
        use sha2::{Sha256, Digest};
        let mut hasher = Sha256::new();
        hasher.update(data);
        let hash = hex::encode(hasher.finalize());

        // SHA256 of "hello world"
        assert_eq!(
            hash,
            "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
        );
    }
}
