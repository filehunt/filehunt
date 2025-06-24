use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};
use std::path::PathBuf;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Repository {
    pub id: String,
    pub name: String,
    pub owner: String,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
    pub description: Option<String>,
    pub latest_commit_sha: Option<String>,  // Git SHA instead of UUID
    pub default_branch: String,
    pub local_path: Option<String>,  // Path to local Git repository
    pub s3_synced: bool,
    pub last_sync: Option<DateTime<Utc>>,
    pub total_commits: u64,
    pub total_files: u64,
    pub repository_size: u64,  // Size in bytes
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
    pub branches: Vec<String>,
    pub head_commit: Option<crate::models::Commit>,
    pub status: RepositoryStatus,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RepositoryStatus {
    pub is_initialized: bool,
    pub has_commits: bool,
    pub is_syncing: bool,
    pub sync_status: SyncStatus,
    pub pending_files: u32,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum SyncStatus {
    Synced,
    Pending,
    Syncing,
    Error(String),
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CloneRepositoryRequest {
    pub repository_id: String,
    pub target_branch: Option<String>,
    pub shallow: bool,  // Shallow clone option
}

#[derive(Debug, Serialize, Deserialize)]
pub struct RepositoryFileTree {
    pub path: String,
    pub name: String,
    pub file_type: FileTreeType,
    pub size: Option<u64>,
    pub last_modified: DateTime<Utc>,
    pub commit_sha: String,
    pub children: Option<Vec<RepositoryFileTree>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum FileTreeType {
    File,
    Directory,
    Symlink,
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
            latest_commit_sha: None,
            default_branch: "main".to_string(),
            local_path: None,
            s3_synced: false,
            last_sync: None,
            total_commits: 0,
            total_files: 0,
            repository_size: 0,
        }
    }

    pub fn storage_prefix(&self) -> String {
        format!("repositories/{}", self.id)
    }

    pub fn metadata_key(&self) -> String {
        format!("{}/repo_meta.json", self.storage_prefix())
    }

    pub fn git_archive_key(&self) -> String {
        format!("{}/git_archive.tar.gz", self.storage_prefix())
    }

    pub fn local_git_path(&self) -> PathBuf {
        PathBuf::from("/var/git-repositories").join(&self.id)
    }

    pub fn update_stats(&mut self, commit_count: u64, file_count: u64, size: u64) {
        self.total_commits = commit_count;
        self.total_files = file_count;
        self.repository_size = size;
        self.updated_at = Utc::now();
    }

    pub fn mark_synced(&mut self) {
        self.s3_synced = true;
        self.last_sync = Some(Utc::now());
        self.updated_at = Utc::now();
    }

    pub fn needs_sync(&self) -> bool {
        !self.s3_synced || 
        self.last_sync.map_or(true, |sync| {
            Utc::now().signed_duration_since(sync).num_minutes() > 5
        })
    }
}

impl Default for SyncStatus {
    fn default() -> Self {
        SyncStatus::Pending
    }
}