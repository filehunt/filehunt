use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct FileEvent {
    pub event_type: FileEventType,
    pub file_id: Uuid,
    pub user_id: Uuid,
    pub file_name: String,
    pub file_size: Option<u64>,
    pub content_type: Option<String>,
    pub s3_key: Option<String>,
    pub version_id: Option<Uuid>,
    pub commit_hash: Option<String>,
    pub metadata: serde_json::Value,
    pub timestamp: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum FileEventType {
    FileUploaded,
    FileProcessingStarted,
    FileProcessingCompleted,
    FileProcessingFailed,
    FileVersionCreated,
    FileDeleted,
    FileMetadataUpdated,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct S3ObjectInfo {
    pub bucket: String,
    pub key: String,
    pub size: Option<u64>,
    pub etag: Option<String>,
    pub content_type: Option<String>,
    pub last_modified: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ProcessingJob {
    pub job_id: Uuid,
    pub job_type: ProcessingJobType,
    pub file_id: Uuid,
    pub user_id: Uuid,
    pub input_s3_key: String,
    pub output_s3_prefix: Option<String>,
    pub parameters: serde_json::Value,
    pub priority: JobPriority,
    pub created_at: DateTime<Utc>,
    pub scheduled_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum ProcessingJobType {
    ImageResize,
    VideoTranscode,
    DocumentPreview,
    AudioTranscode,
    VirusCheck,
    ContentAnalysis,
    ThumbnailGeneration,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum JobPriority {
    Low,
    Medium,
    High,
    Critical,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NotificationEvent {
    pub notification_id: Uuid,
    pub notification_type: NotificationType,
    pub recipient_user_id: Uuid,
    pub title: String,
    pub message: String,
    pub data: serde_json::Value,
    pub channels: Vec<NotificationChannel>,
    pub created_at: DateTime<Utc>,
    pub scheduled_at: Option<DateTime<Utc>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum NotificationType {
    FileUploadComplete,
    FileProcessingComplete,
    FileProcessingFailed,
    FileShared,
    FileCommented,
    SystemAlert,
    QuotaWarning,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum NotificationChannel {
    Email,
    Push,
    InApp,
    Webhook,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ErrorContext {
    pub error_id: Uuid,
    pub service: String,
    pub operation: String,
    pub error_code: String,
    pub error_message: String,
    pub context: serde_json::Value,
    pub timestamp: DateTime<Utc>,
    pub user_id: Option<Uuid>,
    pub file_id: Option<Uuid>,
}