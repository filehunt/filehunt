use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Commit {
    pub id: Uuid,
    pub message: String,
    pub author: String,
    pub timestamp: DateTime<Utc>,
    pub file_path: String,
    pub file_hash: String,
    pub repository_id: String,
    pub parent_commit_id: Option<Uuid>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CreateCommitRequest {
    pub message: String,
    pub author: String,
    pub file_path: String,
    pub repository_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommitMetadata {
    pub commit: Commit,
    pub created_at: DateTime<Utc>,
    pub storage_path: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommitListResponse {
    pub commits: Vec<Commit>,
    pub total: usize,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommitDetailsResponse {
    pub commit: Commit,
    pub metadata: CommitMetadata,
}

impl Commit {
    pub fn new(
        message: String,
        author: String,
        file_path: String,
        file_hash: String,
        repository_id: String,
        parent_commit_id: Option<Uuid>,
    ) -> Self {
        Self {
            id: Uuid::new_v4(),
            message,
            author,
            timestamp: Utc::now(),
            file_path,
            file_hash,
            repository_id,
            parent_commit_id,
        }
    }

    pub fn storage_key(&self) -> String {
        format!("repositories/{}/commits/{}", self.repository_id, self.id)
    }

    pub fn metadata_key(&self) -> String {
        format!("{}/meta.json", self.storage_key())
    }

    pub fn file_storage_key(&self) -> String {
        format!("{}/file", self.storage_key())
    }
}