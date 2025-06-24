use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct S3Config {
    pub bucket: String,
    pub region: String,
    pub endpoint: Option<String>,
    pub access_key_id: String,
    pub secret_access_key: String,
}

impl S3Config {
    pub fn new(bucket: String, region: String) -> Self {
        Self {
            bucket,
            region,
            endpoint: None,
            access_key_id: env::var("AWS_ACCESS_KEY_ID").unwrap_or_default(),
            secret_access_key: env::var("AWS_SECRET_ACCESS_KEY").unwrap_or_default(),
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

    pub fn from_env(service_name: &str) -> Self {
        let bucket = env::var(format!("{}_S3_BUCKET", service_name.to_uppercase()))
            .unwrap_or_else(|_| format!("filehunt-{}", service_name));
        let region = env::var("S3_REGION").unwrap_or_else(|_| "us-east-1".to_string());
        let endpoint = env::var("S3_ENDPOINT").ok();
        let access_key_id = env::var("AWS_ACCESS_KEY_ID").unwrap_or_else(|_| "test".to_string());
        let secret_access_key = env::var("AWS_SECRET_ACCESS_KEY").unwrap_or_else(|_| "test".to_string());

        Self {
            bucket,
            region,
            endpoint,
            access_key_id,
            secret_access_key,
        }
    }
}

impl Default for S3Config {
    fn default() -> Self {
        Self::from_env("shared")
    }
}