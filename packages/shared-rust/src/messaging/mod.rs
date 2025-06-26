pub mod sns;
pub mod sqs;
pub mod config;

pub use sns::SnsService;
pub use sqs::SqsService;
pub use config::MessagingConfig;

use crate::types::{FileEvent, ProcessingJob, NotificationEvent, ErrorContext};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EventMessage<T> {
    pub message_id: Uuid,
    pub event_type: String,
    pub source: String,
    pub data: T,
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub correlation_id: Option<Uuid>,
    pub retry_count: u32,
}

impl<T> EventMessage<T> {
    pub fn new(event_type: String, source: String, data: T) -> Self {
        Self {
            message_id: Uuid::new_v4(),
            event_type,
            source,
            data,
            timestamp: chrono::Utc::now(),
            correlation_id: None,
            retry_count: 0,
        }
    }

    pub fn with_correlation_id(mut self, correlation_id: Uuid) -> Self {
        self.correlation_id = Some(correlation_id);
        self
    }

    pub fn increment_retry(mut self) -> Self {
        self.retry_count += 1;
        self
    }
}

// Convenience type aliases for common message types
pub type FileEventMessage = EventMessage<FileEvent>;
pub type ProcessingJobMessage = EventMessage<ProcessingJob>;
pub type NotificationMessage = EventMessage<NotificationEvent>;
pub type ErrorMessage = EventMessage<ErrorContext>;

#[derive(Debug, thiserror::Error)]
pub enum MessagingError {
    #[error("SNS error: {0}")]
    SnsError(String),
    #[error("SQS error: {0}")]
    SqsError(String),
    #[error("Serialization error: {0}")]
    SerializationError(#[from] serde_json::Error),
    #[error("Configuration error: {0}")]
    ConfigError(String),
}

pub type Result<T> = std::result::Result<T, MessagingError>;