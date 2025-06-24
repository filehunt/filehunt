use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Commit {
    pub id: String,  // Git SHA instead of UUID
    pub message: String,
    pub author: String,
    pub email: String,
    pub timestamp: DateTime<Utc>,
    pub files: Vec<CommitFile>,
    pub repository_id: String,
    pub parent_commit_ids: Vec<String>,  // Support for merge commits
    pub tree_sha: String,  // Git tree SHA
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommitFile {
    pub path: String,        // Relative path in repository
    pub content_hash: String, // SHA of the content
    pub mode: FileMode,      // File permissions/type
    pub size: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub enum FileMode {
    File,
    Executable,
    Symlink,
    Directory,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateCommitRequest {
    pub message: String,
    pub author: String,
    pub email: String,
    pub files: Vec<CreateCommitFile>,
    pub repository_id: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateCommitFile {
    pub path: String,
    pub content: String,  // Base64 encoded content
    pub mode: Option<FileMode>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CommitMetadata {
    pub commit: Commit,
    pub created_at: DateTime<Utc>,
    pub local_path: String,
    pub s3_synced: bool,
    pub sync_timestamp: Option<DateTime<Utc>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommitListResponse {
    pub commits: Vec<Commit>,
    pub total: usize,
    pub repository_head: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CommitDetailsResponse {
    pub commit: Commit,
    pub metadata: CommitMetadata,
    pub diff: Option<String>,  // Git diff output
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FileUploadRequest {
    pub repository_id: String,
    pub files: Vec<FileUpload>,
    pub commit_message: Option<String>,
    pub auto_commit: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FileUpload {
    pub file_service_id: String,  // ID from file-service
    pub target_path: String,      // Where to place in git repo
    pub mode: Option<FileMode>,
}

impl Commit {
    pub fn new(
        git_sha: String,
        message: String,
        author: String,
        email: String,
        files: Vec<CommitFile>,
        repository_id: String,
        parent_commit_ids: Vec<String>,
        tree_sha: String,
    ) -> Self {
        Self {
            id: git_sha,
            message,
            author,
            email,
            timestamp: Utc::now(),
            files,
            repository_id,
            parent_commit_ids,
            tree_sha,
        }
    }

    pub fn storage_key(&self) -> String {
        format!("repositories/{}/commits/{}", self.repository_id, self.id)
    }

    pub fn metadata_key(&self) -> String {
        format!("{}/meta.json", self.storage_key())
    }

    pub fn is_merge_commit(&self) -> bool {
        self.parent_commit_ids.len() > 1
    }

    pub fn file_count(&self) -> usize {
        self.files.len()
    }

    pub fn total_size(&self) -> u64 {
        self.files.iter().map(|f| f.size).sum()
    }
}

impl CommitFile {
    pub fn new(path: String, content_hash: String, size: u64, mode: FileMode) -> Self {
        Self {
            path,
            content_hash,
            mode,
            size,
        }
    }

    pub fn is_binary(&self) -> bool {
        // Simple heuristic based on file extension
        let path = self.path.to_lowercase();
        path.ends_with(".jpg") || path.ends_with(".jpeg") || path.ends_with(".png") 
            || path.ends_with(".gif") || path.ends_with(".pdf") || path.ends_with(".zip")
            || path.ends_with(".tar") || path.ends_with(".gz") || path.ends_with(".bin")
    }
}

impl FileMode {
    pub fn to_git_filemode(&self) -> git2::FileMode {
        match self {
            FileMode::File => git2::FileMode::Blob,
            FileMode::Executable => git2::FileMode::BlobExecutable,
            FileMode::Symlink => git2::FileMode::Link,
            FileMode::Directory => git2::FileMode::Tree,
        }
    }

    pub fn from_git_filemode(mode: git2::FileMode) -> Self {
        match mode {
            git2::FileMode::BlobExecutable => FileMode::Executable,
            git2::FileMode::Link => FileMode::Symlink,
            git2::FileMode::Tree => FileMode::Directory,
            _ => FileMode::File,
        }
    }
}

impl Default for FileMode {
    fn default() -> Self {
        FileMode::File
    }
}