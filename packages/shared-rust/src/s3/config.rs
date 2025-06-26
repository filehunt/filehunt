use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct S3Config {
    pub region: String,
    pub endpoint: Option<String>,
    pub access_key_id: String,
    pub secret_access_key: String,
    pub buckets: S3BucketConfig,
    pub presigned_url_expiry_seconds: u64,
    pub kms_key_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct S3BucketConfig {
    pub file_storage: String,
    pub git_repositories: String,
    pub shared: String,
    pub processing_temp: String,
}

impl S3Config {
    pub fn new(region: String, buckets: S3BucketConfig) -> Self {
        Self {
            region,
            endpoint: None,
            access_key_id: env::var("AWS_ACCESS_KEY_ID").unwrap_or_default(),
            secret_access_key: env::var("AWS_SECRET_ACCESS_KEY").unwrap_or_default(),
            buckets,
            presigned_url_expiry_seconds: 3600, // 1 hour default
            kms_key_id: None,
        }
    }

    pub fn with_endpoint(mut self, endpoint: String) -> Self {
        self.endpoint = Some(endpoint);
        self
    }

    pub fn with_credentials(mut self, access_key_id: String, secret_access_key: String) -> Self {
        self.access_key_id = access_key_id;
        self.secret_access_key = secret_access_key;
        self
    }

    pub fn with_kms_key(mut self, kms_key_id: String) -> Self {
        self.kms_key_id = Some(kms_key_id);
        self
    }

    pub fn with_presigned_expiry(mut self, seconds: u64) -> Self {
        self.presigned_url_expiry_seconds = seconds;
        self
    }

    pub fn from_env() -> Self {
        let region = env::var("AWS_REGION").unwrap_or_else(|_| "us-east-1".to_string());
        let endpoint = env::var("S3_ENDPOINT").ok();
        let access_key_id = env::var("AWS_ACCESS_KEY_ID").unwrap_or_else(|_| "test".to_string());
        let secret_access_key = env::var("AWS_SECRET_ACCESS_KEY").unwrap_or_else(|_| "test".to_string());
        let presigned_url_expiry_seconds = env::var("S3_PRESIGNED_URL_EXPIRY_SECONDS")
            .unwrap_or_else(|_| "3600".to_string())
            .parse()
            .unwrap_or(3600);
        let kms_key_id = env::var("S3_KMS_KEY_ID").ok();

        let buckets = S3BucketConfig {
            file_storage: env::var("S3_FILE_BUCKET").unwrap_or_else(|_| "filehunt-files".to_string()),
            git_repositories: env::var("S3_GIT_BUCKET").unwrap_or_else(|_| "filehunt-git".to_string()),
            shared: env::var("S3_SHARED_BUCKET").unwrap_or_else(|_| "filehunt-shared".to_string()),
            processing_temp: env::var("S3_PROCESSING_BUCKET").unwrap_or_else(|_| "filehunt-processing".to_string()),
        };

        Self {
            region,
            endpoint,
            access_key_id,
            secret_access_key,
            buckets,
            presigned_url_expiry_seconds,
            kms_key_id,
        }
    }

    pub fn get_bucket(&self, bucket_type: S3BucketType) -> &str {
        match bucket_type {
            S3BucketType::FileStorage => &self.buckets.file_storage,
            S3BucketType::GitRepositories => &self.buckets.git_repositories,
            S3BucketType::Shared => &self.buckets.shared,
            S3BucketType::ProcessingTemp => &self.buckets.processing_temp,
        }
    }
}

impl S3BucketConfig {
    pub fn new(file_storage: String, git_repositories: String, shared: String, processing_temp: String) -> Self {
        Self {
            file_storage,
            git_repositories,
            shared,
            processing_temp,
        }
    }
}

#[derive(Debug, Clone, Copy)]
pub enum S3BucketType {
    FileStorage,
    GitRepositories,
    Shared,
    ProcessingTemp,
}

impl Default for S3Config {
    fn default() -> Self {
        Self::from_env()
    }
}