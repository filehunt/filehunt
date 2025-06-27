use anyhow::Result;
use base64::{Engine as _, engine::general_purpose};
use reqwest::Client as HttpClient;
use serde_json;
use tracing::{error, info};
use uuid::Uuid;

use crate::config::Config;
use crate::models::GitCommitResponse;

#[derive(Clone)]
pub struct GitService {
    client: HttpClient,
    base_url: String,
}

impl GitService {
    pub fn new(config: &Config) -> Self {
        Self {
            client: HttpClient::new(),
            base_url: config.git_service_url.clone(),
        }
    }

    pub async fn create_commit(
        &self,
        repository_id: &str,
        file_path: &str,
        s3_key: &str,
        commit_message: &str,
        author_name: &str,
        author_email: &str,
    ) -> Result<GitCommitResponse> {
        // First, create the repository if it doesn't exist and get the actual repository ID
        let actual_repository_id = match self.ensure_repository_exists(repository_id).await {
            Ok(id) => id,
            Err(err) => {
                error!("Failed to ensure repository exists: {}", err);
                return Err(err);
            }
        };

        // Download file content from S3
        let file_content = self.download_file_from_s3(s3_key).await?;
        
        // Create request in the format expected by git-service
        let request = serde_json::json!({
            "message": commit_message,
            "author": author_name,
            "email": author_email,
            "repository_id": actual_repository_id,
            "files": [{
                "path": file_path,
                "content": general_purpose::STANDARD.encode(&file_content),
                "mode": "File"
            }]
        });

        let url = format!("{}/repositories/{}/commits", self.base_url, actual_repository_id);
        
        let response = self
            .client
            .post(&url)
            .json(&request)
            .send()
            .await?;

        if response.status().is_success() {
            let git_response: serde_json::Value = response.json().await?;
            
            // Extract commit hash from the response
            let commit_hash = git_response["id"]
                .as_str()
                .unwrap_or_default()
                .to_string();
            
            info!("Successfully created git commit: {}", commit_hash);
            
            Ok(GitCommitResponse {
                commit_hash: commit_hash.clone(),
                commit_id: commit_hash.clone(),
                tree_hash: git_response["tree_sha"].as_str().unwrap_or_default().to_string(),
                parent_commit: None,
            })
        } else {
            let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            error!("Git service error: {}", error_text);
            Err(anyhow::anyhow!("Git service error: {}", error_text))
        }
    }

    pub async fn create_repository(&self, repository_name: &str, user_id: Uuid) -> Result<String> {
        let request_body = serde_json::json!({
            "name": repository_name,
            "user_id": user_id,
            "description": format!("Repository for user {}", user_id)
        });

        let url = format!("{}/repositories", self.base_url);
        
        let response = self
            .client
            .post(&url)
            .json(&request_body)
            .send()
            .await?;

        if response.status().is_success() {
            let result: serde_json::Value = response.json().await?;
            let repository_id = result["id"]
                .as_str()
                .ok_or_else(|| anyhow::anyhow!("Repository ID not found in response"))?;
            
            info!("Successfully created repository: {}", repository_id);
            Ok(repository_id.to_string())
        } else {
            let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            error!("Git service error creating repository: {}", error_text);
            Err(anyhow::anyhow!("Git service error: {}", error_text))
        }
    }

    pub async fn get_commit(&self, repository_id: &str, commit_id: &str) -> Result<serde_json::Value> {
        let url = format!("{}/repositories/{}/commits/{}", self.base_url, repository_id, commit_id);
        
        let response = self
            .client
            .get(&url)
            .send()
            .await?;

        if response.status().is_success() {
            let commit_data: serde_json::Value = response.json().await?;
            Ok(commit_data)
        } else {
            let error_text = response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            error!("Git service error getting commit: {}", error_text);
            Err(anyhow::anyhow!("Git service error: {}", error_text))
        }
    }

    pub async fn health_check(&self) -> Result<bool> {
        let url = format!("{}/health", self.base_url);
        
        match self.client.get(&url).send().await {
            Ok(response) => Ok(response.status().is_success()),
            Err(err) => {
                error!("Git service health check failed: {}", err);
                Ok(false)
            }
        }
    }

    async fn ensure_repository_exists(&self, repository_id: &str) -> Result<String> {
        // Check if repository exists
        let url = format!("{}/repositories/{}", self.base_url, repository_id);
        let response = self.client.get(&url).send().await?;
        
        if response.status().is_success() {
            return Ok(repository_id.to_string());
        }
        
        // Repository doesn't exist, create it
        let create_request = serde_json::json!({
            "name": repository_id,
            "owner": "file-service",
            "description": format!("Auto-created repository for {}", repository_id)
        });
        
        let create_url = format!("{}/repositories", self.base_url);
        let create_response = self
            .client
            .post(&create_url)
            .json(&create_request)
            .send()
            .await?;
            
        if create_response.status().is_success() {
            let result: serde_json::Value = create_response.json().await?;
            let actual_repository_id = result["repository"]["id"]
                .as_str()
                .ok_or_else(|| anyhow::anyhow!("Repository ID not found in response"))?;
            
            info!("Created new repository: {} with actual ID: {}", repository_id, actual_repository_id);
            Ok(actual_repository_id.to_string())
        } else {
            let error_text = create_response.text().await.unwrap_or_else(|_| "Unknown error".to_string());
            Err(anyhow::anyhow!("Failed to create repository: {}", error_text))
        }
    }

    async fn download_file_from_s3(&self, s3_key: &str) -> Result<Vec<u8>> {
        // Create a temporary S3 client to download the file
        let s3_config = shared_rust::s3::S3Config::from_env();
        let s3_service = shared_rust::s3::S3Service::from_config(&s3_config).await?;
        
        // Download file content
        let content = s3_service.get_object(shared_rust::s3::config::S3BucketType::FileStorage, s3_key).await?;
        
        Ok(content.to_vec())
    }
}