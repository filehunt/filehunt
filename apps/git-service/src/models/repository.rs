use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Repository {
    pub id: String,
    pub name: String,
    pub owner: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub description: Option<String>,
    pub latest_commit_id: Option<Uuid>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateRepositoryRequest {
    pub name: String,
    pub owner: String,
    pub description: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RepositoryResponse {
    pub repository: Repository,
    pub commit_count: usize,
}

impl Repository {
    pub fn new(name: String, owner: String, description: Option<String>) -> Self {
        let now = Utc::now();
        Self {
            id: format!("{}_{}", owner, name),
            name,
            owner,
            created_at: now,
            updated_at: now,
            description,
            latest_commit_id: None,
        }
    }

    pub fn storage_prefix(&self) -> String {
        format!("repositories/{}", self.id)
    }

    pub fn metadata_key(&self) -> String {
        format!("{}/repo_meta.json", self.storage_prefix())
    }
}