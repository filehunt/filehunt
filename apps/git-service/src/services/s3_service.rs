use aws_sdk_s3::{primitives::ByteStream, Client as S3Client};
use bytes::Bytes;
use sha2::{Digest, Sha256};

use crate::models::{GitServiceError, Result};

pub struct S3Service {
    client: S3Client,
    bucket: String,
}

impl S3Service {
    pub fn new(client: S3Client, bucket: String) -> Self {
        Self { client, bucket }
    }

    pub async fn put_object(&self, key: &str, data: Bytes) -> Result<String> {
        let body = ByteStream::from(data.clone());

        self.client
            .put_object()
            .bucket(&self.bucket)
            .key(key)
            .body(body)
            .send()
            .await
            .map_err(|e| {
                GitServiceError::S3Error(format!("Failed to put object {}: {}", key, e))
            })?;

        // Calculate hash for verification
        let mut hasher = Sha256::new();
        hasher.update(&data);
        let hash = hex::encode(hasher.finalize());

        Ok(hash)
    }

    pub async fn get_object(&self, key: &str) -> Result<Bytes> {
        let response = self
            .client
            .get_object()
            .bucket(&self.bucket)
            .key(key)
            .send()
            .await
            .map_err(|e| {
                GitServiceError::S3Error(format!("Failed to get object {}: {}", key, e))
            })?;

        let data = response
            .body
            .collect()
            .await
            .map_err(|e| {
                GitServiceError::S3Error(format!("Failed to read object body {}: {}", key, e))
            })?
            .into_bytes();

        Ok(data)
    }

    pub async fn object_exists(&self, key: &str) -> Result<bool> {
        match self
            .client
            .head_object()
            .bucket(&self.bucket)
            .key(key)
            .send()
            .await
        {
            Ok(_) => Ok(true),
            Err(e) => {
                let error_str = e.to_string();
                if error_str.contains("NoSuchKey") || error_str.contains("NotFound") {
                    Ok(false)
                } else {
                    Err(GitServiceError::S3Error(format!(
                        "Failed to check object existence {}: {}",
                        key, e
                    )))
                }
            }
        }
    }

    pub async fn list_objects_with_prefix(&self, prefix: &str) -> Result<Vec<String>> {
        let response = self
            .client
            .list_objects_v2()
            .bucket(&self.bucket)
            .prefix(prefix)
            .send()
            .await
            .map_err(|e| {
                GitServiceError::S3Error(format!(
                    "Failed to list objects with prefix {}: {}",
                    prefix, e
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

    pub async fn delete_object(&self, key: &str) -> Result<()> {
        self.client
            .delete_object()
            .bucket(&self.bucket)
            .key(key)
            .send()
            .await
            .map_err(|e| {
                GitServiceError::S3Error(format!("Failed to delete object {}: {}", key, e))
            })?;

        Ok(())
    }

    pub async fn copy_object(&self, source_key: &str, dest_key: &str) -> Result<()> {
        let copy_source = format!("{}/{}", self.bucket, source_key);

        self.client
            .copy_object()
            .bucket(&self.bucket)
            .copy_source(&copy_source)
            .key(dest_key)
            .send()
            .await
            .map_err(|e| {
                GitServiceError::S3Error(format!(
                    "Failed to copy object {} to {}: {}",
                    source_key, dest_key, e
                ))
            })?;

        Ok(())
    }

    pub fn calculate_file_hash(&self, data: &[u8]) -> String {
        let mut hasher = Sha256::new();
        hasher.update(data);
        hex::encode(hasher.finalize())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_calculate_file_hash() {
        let config = aws_sdk_s3::Config::builder().build();
        let s3_client = S3Client::from_conf(config);
        let s3_service = S3Service::new(s3_client, "test-bucket".to_string());

        let data = b"hello world";
        let hash = s3_service.calculate_file_hash(data);

        // SHA256 of "hello world"
        assert_eq!(
            hash,
            "b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9"
        );
    }
}
