use anyhow::Result;
use chrono::{DateTime, Duration, Utc};

use tracing::{error, info, warn};
use uuid::Uuid;

use shared_rust::s3::{S3Service as BaseS3Service, S3Config};
use shared_rust::s3::config::S3BucketType;
use shared_rust::types::S3ObjectInfo;

use crate::config::Config;

#[derive(Clone)]
pub struct FileS3Service {
    base_service: BaseS3Service,
    config: Config,
}

impl FileS3Service {
    pub async fn new(config: &Config) -> Result<Self> {
        let s3_config = S3Config::from_env()
            .with_kms_key(
                config.s3_kms_key_id
                    .clone()
                    .unwrap_or_else(|| "alias/filehunt-file-encryption".to_string())
            )
            .with_presigned_expiry(config.s3_presigned_url_expiry);

        let base_service = BaseS3Service::from_config(&s3_config).await?;

        Ok(Self {
            base_service,
            config: config.clone(),
        })
    }

    pub async fn generate_presigned_upload_url(
        &self,
        file_id: Uuid,
        version_id: Uuid,
        filename: &str,
        content_type: &str,
        file_size: u64,
    ) -> Result<(String, String, DateTime<Utc>)> {
        let s3_key = self.generate_file_key(file_id, version_id, filename);
        
        let expires_at = Utc::now() + Duration::seconds(self.config.s3_presigned_url_expiry as i64);

        let presigned_url = self
            .base_service
            .generate_presigned_upload_url(
                S3BucketType::FileStorage,
                &s3_key,
                content_type,
                file_size,
            )
            .await?;

        info!("Generated presigned upload URL for file {} version {} with key {}", file_id, version_id, s3_key);

        Ok((presigned_url, s3_key, expires_at))
    }

    pub async fn generate_presigned_download_url(&self, s3_key: &str) -> Result<String> {
        let presigned_url = self
            .base_service
            .generate_presigned_download_url(S3BucketType::FileStorage, s3_key)
            .await?;

        info!("Generated presigned download URL for key: {}", s3_key);
        Ok(presigned_url)
    }

    pub async fn verify_file_exists(&self, s3_key: &str) -> Result<bool> {
        self.base_service
            .object_exists(S3BucketType::FileStorage, s3_key)
            .await
            .map_err(|e| anyhow::anyhow!("S3 error: {}", e))
    }

    pub async fn get_file_metadata(&self, s3_key: &str) -> Result<Option<S3ObjectInfo>> {
        match self.base_service.get_object_metadata(S3BucketType::FileStorage, s3_key).await {
            Ok(metadata) => {
                let s3_info = S3ObjectInfo {
                    bucket: self.config.s3_file_bucket.clone(),
                    key: s3_key.to_string(),
                    size: metadata.get("content-length")
                        .and_then(|s| s.parse().ok()),
                    etag: metadata.get("etag").cloned(),
                    content_type: metadata.get("content-type").cloned(),
                    last_modified: metadata.get("last-modified")
                        .and_then(|s| DateTime::parse_from_rfc3339(s).ok())
                        .map(|dt| dt.with_timezone(&Utc)),
                };
                Ok(Some(s3_info))
            }
            Err(e) => {
                if e.to_string().contains("NotFound") || e.to_string().contains("404") {
                    Ok(None)
                } else {
                    error!("Error getting file metadata for {}: {}", s3_key, e);
                    Err(e.into())
                }
            }
        }
    }

    pub async fn delete_file(&self, s3_key: &str) -> Result<()> {
        self.base_service
            .delete_object(S3BucketType::FileStorage, s3_key)
            .await?;

        info!("Deleted file with key: {}", s3_key);
        Ok(())
    }

    pub async fn copy_file(&self, source_key: &str, dest_key: &str) -> Result<()> {
        self.base_service
            .copy_object(S3BucketType::FileStorage, source_key, dest_key)
            .await?;

        info!("Copied file from {} to {}", source_key, dest_key);
        Ok(())
    }

    pub async fn move_to_processing_bucket(&self, source_key: &str, processing_job_id: Uuid) -> Result<String> {
        let dest_key = format!("processing/{}/{}", processing_job_id, 
            source_key.split('/').last().unwrap_or("file"));

        // Copy to processing bucket
        let processing_s3_config = S3Config::from_env();
        let processing_service = BaseS3Service::from_config(&processing_s3_config).await?;
        
        // Get the file from main bucket
        let file_data = self.base_service.get_object(S3BucketType::FileStorage, source_key).await?;
        
        // Put in processing bucket
        processing_service.put_object(S3BucketType::ProcessingTemp, &dest_key, file_data).await?;

        info!("Moved file {} to processing bucket as {}", source_key, dest_key);
        Ok(dest_key)
    }

    pub async fn list_user_files(&self, user_id: Uuid, prefix: Option<&str>) -> Result<Vec<String>> {
        let search_prefix = match prefix {
            Some(p) => format!("files/{}/{}", user_id, p),
            None => format!("files/{}/", user_id),
        };

        self.base_service
            .list_objects_with_prefix(S3BucketType::FileStorage, &search_prefix)
            .await
            .map_err(|e| anyhow::anyhow!("S3 error: {}", e))
    }

    pub async fn cleanup_old_versions(&self, file_id: Uuid, keep_versions: usize) -> Result<Vec<String>> {
        let prefix = format!("files/{}/", file_id);
        let mut objects = self.base_service
            .list_objects_with_prefix(S3BucketType::FileStorage, &prefix)
            .await?;

        if objects.len() <= keep_versions {
            return Ok(Vec::new());
        }

        // Sort by key (which includes timestamp) and keep only the latest versions
        objects.sort();
        objects.reverse(); // Most recent first

        let to_delete = objects.into_iter().skip(keep_versions).collect::<Vec<_>>();
        let mut deleted_keys = Vec::new();

        for key in &to_delete {
            match self.base_service.delete_object(S3BucketType::FileStorage, key).await {
                Ok(_) => {
                    deleted_keys.push(key.clone());
                    info!("Deleted old version: {}", key);
                }
                Err(e) => {
                    warn!("Failed to delete old version {}: {}", key, e);
                }
            }
        }

        Ok(deleted_keys)
    }

    pub fn generate_file_key(&self, file_id: Uuid, version_id: Uuid, filename: &str) -> String {
        let sanitized_filename = self.sanitize_filename(filename);
        format!("files/{}/versions/{}/{}", file_id, version_id, sanitized_filename)
    }

    pub fn generate_thumbnail_key(&self, file_id: Uuid, version_id: Uuid, size: &str) -> String {
        format!("files/{}/versions/{}/thumbnails/{}.jpg", file_id, version_id, size)
    }

    pub fn generate_preview_key(&self, file_id: Uuid, version_id: Uuid, format: &str) -> String {
        format!("files/{}/versions/{}/preview.{}", file_id, version_id, format)
    }

    fn sanitize_filename(&self, filename: &str) -> String {
        filename
            .chars()
            .filter(|c| c.is_alphanumeric() || *c == '.' || *c == '-' || *c == '_')
            .collect::<String>()
            .trim_matches('.')
            .to_string()
    }

    pub fn extract_file_id_from_key(&self, s3_key: &str) -> Option<Uuid> {
        let parts: Vec<&str> = s3_key.split('/').collect();
        if parts.len() >= 2 && parts[0] == "files" {
            Uuid::parse_str(parts[1]).ok()
        } else {
            None
        }
    }

    pub fn extract_version_id_from_key(&self, s3_key: &str) -> Option<Uuid> {
        let parts: Vec<&str> = s3_key.split('/').collect();
        if parts.len() >= 4 && parts[0] == "files" && parts[2] == "versions" {
            Uuid::parse_str(parts[3]).ok()
        } else {
            None
        }
    }

    pub async fn validate_file_integrity(&self, s3_key: &str, expected_hash: &str) -> Result<bool> {
        match self.get_file_metadata(s3_key).await? {
            Some(metadata) => {
                if let Some(etag) = metadata.etag {
                    // ETags can be MD5 for simple uploads or a different format for multipart
                    let actual_hash = etag.trim_matches('"');
                    Ok(actual_hash == expected_hash || expected_hash.starts_with(actual_hash))
                } else {
                    warn!("No ETag found for file: {}", s3_key);
                    Ok(false)
                }
            }
            None => {
                warn!("File not found for integrity check: {}", s3_key);
                Ok(false)
            }
        }
    }

    pub async fn get_bucket_for_file_storage(&self) -> &str {
        &self.config.s3_file_bucket
    }

    pub fn calculate_storage_cost(&self, file_size: u64, storage_class: &str) -> f64 {
        // Simple cost calculation - this would be more sophisticated in production
        let gb_size = file_size as f64 / (1024.0 * 1024.0 * 1024.0);
        match storage_class {
            "STANDARD" => gb_size * 0.023, // $0.023 per GB per month
            "STANDARD_IA" => gb_size * 0.0125,
            "GLACIER" => gb_size * 0.004,
            _ => gb_size * 0.023,
        }
    }
}