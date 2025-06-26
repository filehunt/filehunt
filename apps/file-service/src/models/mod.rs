use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use sqlx::FromRow;

// Main file metadata table - represents the file identity
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct FileMetadata {
    pub id: Uuid,
    pub user_id: Uuid,
    pub filename: String,
    pub original_filename: String,
    pub content_type: String,
    pub tags: Option<serde_json::Value>,
    pub status: FileStatus,
    pub current_version_id: Option<Uuid>,
    pub total_versions: i32,
    pub total_size: i64,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

// File versions table - Git-like versioning
#[derive(Debug, Clone, Serialize, Deserialize, FromRow)]
pub struct FileVersion {
    pub id: Uuid,
    pub file_id: Uuid,
    pub version_number: i32,
    pub s3_key: String,
    pub s3_bucket: String,
    pub file_size: i64,
    pub file_hash: String,
    pub commit_hash: Option<String>,
    pub commit_message: Option<String>,
    pub created_by: Uuid,
    pub parent_version_id: Option<Uuid>,
    pub status: VersionStatus,
    pub processing_metadata: Option<serde_json::Value>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, sqlx::Type)]
#[sqlx(type_name = "file_status", rename_all = "lowercase")]
pub enum FileStatus {
    Active,
    Deleted,
    Archived,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, sqlx::Type)]
#[sqlx(type_name = "version_status", rename_all = "lowercase")]
pub enum VersionStatus {
    Uploading,
    Processing,
    Ready,
    Failed,
    Deleted,
}

// API Request/Response models
#[derive(Debug, Deserialize)]
pub struct PrepareUploadRequest {
    pub filename: String,
    pub content_type: String,
    pub file_size: u64,
    pub tags: Option<serde_json::Value>,
    pub commit_message: Option<String>,
    pub parent_version_id: Option<Uuid>,
}

#[derive(Debug, Serialize)]
pub struct PrepareUploadResponse {
    pub file_id: Uuid,
    pub version_id: Uuid,
    pub presigned_url: String,
    pub s3_key: String,
    pub expires_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct CompleteUploadRequest {
    pub file_id: Uuid,
    pub version_id: Uuid,
    pub etag: String,
    pub actual_file_size: Option<u64>,
}

#[derive(Debug, Serialize)]
pub struct CompleteUploadResponse {
    pub file_id: Uuid,
    pub version_id: Uuid,
    pub version_number: i32,
    pub status: VersionStatus,
    pub commit_hash: Option<String>,
    pub file_url: String,
    pub download_url: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct FileResponse {
    pub file_metadata: FileMetadata,
    pub current_version: Option<FileVersionResponse>,
    pub download_url: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct FileVersionResponse {
    pub id: Uuid,
    pub version_number: i32,
    pub file_size: i64,
    pub file_hash: String,
    pub commit_hash: Option<String>,
    pub commit_message: Option<String>,
    pub created_by: Uuid,
    pub status: VersionStatus,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct ListFilesQuery {
    pub user_id: Option<Uuid>,
    pub status: Option<FileStatus>,
    pub content_type: Option<String>,
    pub page: Option<u32>,
    pub limit: Option<u32>,
    pub search: Option<String>,
}

#[derive(Debug, Serialize)]
pub struct ListFilesResponse {
    pub files: Vec<FileResponse>,
    pub total: i64,
    pub page: u32,
    pub limit: u32,
}

#[derive(Debug, Deserialize)]
pub struct ListVersionsQuery {
    pub file_id: Uuid,
    pub page: Option<u32>,
    pub limit: Option<u32>,
}

#[derive(Debug, Serialize)]
pub struct ListVersionsResponse {
    pub file_id: Uuid,
    pub versions: Vec<FileVersionResponse>,
    pub total: i64,
    pub page: u32,
    pub limit: u32,
}

#[derive(Debug, Deserialize)]
pub struct UpdateFileRequest {
    pub filename: Option<String>,
    pub tags: Option<serde_json::Value>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GitCommitRequest {
    pub repository_id: String,
    pub file_path: String,
    pub s3_key: String,
    pub commit_message: String,
    pub author_name: String,
    pub author_email: String,
    pub parent_commit: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct GitCommitResponse {
    pub commit_hash: String,
    pub commit_id: String,
    pub tree_hash: String,
    pub parent_commit: Option<String>,
}

// File processing and events
#[derive(Debug, Serialize, Deserialize)]
pub struct FileProcessingEvent {
    pub file_id: Uuid,
    pub version_id: Uuid,
    pub user_id: Uuid,
    pub event_type: FileEventType,
    pub s3_key: String,
    pub content_type: String,
    pub file_size: u64,
    pub metadata: serde_json::Value,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum FileEventType {
    FileUploaded,
    VersionCreated,
    ProcessingStarted,
    ProcessingCompleted,
    ProcessingFailed,
    FileDeleted,
    VersionDeleted,
}

// Stats and metrics
#[derive(Debug, Serialize, Deserialize)]
pub struct FileStatsResponse {
    pub total_files: i64,
    pub total_versions: i64,
    pub total_size: i64,
    pub files_by_status: serde_json::Value,
    pub versions_by_status: serde_json::Value,
    pub storage_by_content_type: serde_json::Value,
}

#[derive(Debug, Deserialize)]
pub struct CreateFileVersionRequest {
    pub file_id: Uuid,
    pub file_size: u64,
    pub commit_message: Option<String>,
    pub parent_version_id: Option<Uuid>,
}

#[derive(Debug, Serialize)]
pub struct CreateFileVersionResponse {
    pub version_id: Uuid,
    pub presigned_url: String,
    pub s3_key: String,
    pub expires_at: DateTime<Utc>,
}