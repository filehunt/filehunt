use anyhow::Result;
use reqwest::Client as HttpClient;
use serde_json;
use tracing::{error, info};
use uuid::Uuid;

use crate::config::Config;
use crate::models::{GitCommitRequest, GitCommitResponse};

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
        file_content: &str,
        commit_message: &str,
        author_name: &str,
        author_email: &str,
    ) -> Result<GitCommitResponse> {
        let request = GitCommitRequest {
            repository_id: repository_id.to_string(),
            file_path: file_path.to_string(),
            s3_key: file_content.to_string(),
            commit_message: commit_message.to_string(),
            author_name: author_name.to_string(),
            author_email: author_email.to_string(),
            parent_commit: None,
        };

        let url = format!("{}/repositories/{}/commits", self.base_url, repository_id);
        
        let response = self
            .client
            .post(&url)
            .json(&request)
            .send()
            .await?;

        if response.status().is_success() {
            let git_response: GitCommitResponse = response.json().await?;
            info!("Successfully created git commit: {}", git_response.commit_hash);
            Ok(git_response)
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
}