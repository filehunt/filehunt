use serde::{Deserialize, Serialize};
use std::env;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct MessagingConfig {
    pub sns_topic_arn: String,
    pub region: String,
    pub endpoint: Option<String>,
    pub access_key_id: String,
    pub secret_access_key: String,
}

impl MessagingConfig {
    pub fn new(sns_topic_arn: String, region: String) -> Self {
        Self {
            sns_topic_arn,
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
        let sns_topic_arn = env::var(format!("{}_SNS_TOPIC_ARN", service_name.to_uppercase()))
            .unwrap_or_else(|_| format!("arn:aws:sns:us-east-1:000000000000:filehunt-{}-events", service_name));
        let region = env::var("AWS_REGION").unwrap_or_else(|_| "us-east-1".to_string());
        let endpoint = env::var("SNS_ENDPOINT").ok();
        let access_key_id = env::var("AWS_ACCESS_KEY_ID").unwrap_or_else(|_| "test".to_string());
        let secret_access_key = env::var("AWS_SECRET_ACCESS_KEY").unwrap_or_else(|_| "test".to_string());

        Self {
            sns_topic_arn,
            region,
            endpoint,
            access_key_id,
            secret_access_key,
        }
    }
}

impl Default for MessagingConfig {
    fn default() -> Self {
        Self::from_env("shared")
    }
}