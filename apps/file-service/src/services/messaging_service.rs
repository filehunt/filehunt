use anyhow::Result;
use chrono::Utc;
use tracing::{error, info, warn};
use uuid::Uuid;

use shared_rust::messaging::{SnsService, MessagingConfig, EventMessage};
use shared_rust::types::{FileEvent, FileEventType, ProcessingJob, ProcessingJobType, NotificationEvent, NotificationType, NotificationChannel, JobPriority};

use crate::config::Config;
use crate::models::{FileMetadata, FileVersion};

#[derive(Clone)]
pub struct MessagingService {
    sns_service: SnsService,
    config: Config,
}

impl MessagingService {
    pub async fn new(config: &Config) -> Result<Self> {
        let messaging_config = MessagingConfig::new(
            config.sns_topic_arn.clone(),
            config.aws_region.clone(),
        )
        .with_endpoint(config.sns_endpoint.clone().unwrap_or_default())
        .with_credentials(
            config.aws_access_key_id.clone(),
            config.aws_secret_access_key.clone(),
        );

        let sns_service = SnsService::from_config(&messaging_config).await
            .map_err(|e| anyhow::anyhow!("Failed to initialize SNS service: {}", e))?;

        Ok(Self {
            sns_service,
            config: config.clone(),
        })
    }

    pub async fn publish_file_uploaded_event(
        &self,
        file_metadata: &FileMetadata,
        version: &FileVersion,
    ) -> Result<String> {
        let file_event = FileEvent {
            event_type: FileEventType::FileUploaded,
            file_id: file_metadata.id,
            user_id: file_metadata.user_id,
            file_name: file_metadata.filename.clone(),
            file_size: Some(version.file_size as u64),
            content_type: Some(file_metadata.content_type.clone()),
            s3_key: Some(version.s3_key.clone()),
            version_id: Some(version.id),
            commit_hash: version.commit_hash.clone(),
            metadata: serde_json::json!({
                "version_number": version.version_number,
                "s3_bucket": version.s3_bucket,
                "file_hash": version.file_hash,
                "tags": file_metadata.tags
            }),
            timestamp: Utc::now(),
        };

        let message = EventMessage::new(
            "file_uploaded".to_string(),
            "file-service".to_string(),
            file_event,
        ).with_correlation_id(file_metadata.id);

        let message_id = self.sns_service.publish_event(&message).await
            .map_err(|e| anyhow::anyhow!("Failed to publish file uploaded event: {}", e))?;

        info!("Published file uploaded event for file {} with message ID: {}", file_metadata.id, message_id);
        Ok(message_id)
    }

    pub async fn publish_version_created_event(
        &self,
        file_metadata: &FileMetadata,
        version: &FileVersion,
    ) -> Result<String> {
        let file_event = FileEvent {
            event_type: FileEventType::FileVersionCreated,
            file_id: file_metadata.id,
            user_id: file_metadata.user_id,
            file_name: file_metadata.filename.clone(),
            file_size: Some(version.file_size as u64),
            content_type: Some(file_metadata.content_type.clone()),
            s3_key: Some(version.s3_key.clone()),
            version_id: Some(version.id),
            commit_hash: version.commit_hash.clone(),
            metadata: serde_json::json!({
                "version_number": version.version_number,
                "parent_version_id": version.parent_version_id,
                "commit_message": version.commit_message,
                "created_by": version.created_by,
                "s3_bucket": version.s3_bucket,
                "file_hash": version.file_hash
            }),
            timestamp: Utc::now(),
        };

        let message = EventMessage::new(
            "version_created".to_string(),
            "file-service".to_string(),
            file_event,
        ).with_correlation_id(file_metadata.id);

        let message_id = self.sns_service.publish_event(&message).await
            .map_err(|e| anyhow::anyhow!("Failed to publish version created event: {}", e))?;

        info!("Published version created event for file {} version {} with message ID: {}", 
              file_metadata.id, version.version_number, message_id);
        Ok(message_id)
    }

    pub async fn publish_processing_job(
        &self,
        file_metadata: &FileMetadata,
        version: &FileVersion,
        job_type: ProcessingJobType,
        parameters: serde_json::Value,
    ) -> Result<String> {
        let processing_job = ProcessingJob {
            job_id: Uuid::new_v4(),
            job_type,
            file_id: file_metadata.id,
            user_id: file_metadata.user_id,
            input_s3_key: version.s3_key.clone(),
            output_s3_prefix: Some(format!("processed/{}/{}", file_metadata.id, version.id)),
            parameters,
            priority: self.determine_job_priority(&file_metadata.content_type),
            created_at: Utc::now(),
            scheduled_at: None,
        };

        let message = EventMessage::new(
            "processing_job".to_string(),
            "file-service".to_string(),
            processing_job,
        ).with_correlation_id(file_metadata.id);

        let message_id = self.sns_service.publish_event(&message).await
            .map_err(|e| anyhow::anyhow!("Failed to publish processing job: {}", e))?;

        info!("Published processing job for file {} with message ID: {}", file_metadata.id, message_id);
        Ok(message_id)
    }

    pub async fn publish_upload_complete_notification(
        &self,
        file_metadata: &FileMetadata,
        version: &FileVersion,
    ) -> Result<String> {
        let notification = NotificationEvent {
            notification_id: Uuid::new_v4(),
            notification_type: NotificationType::FileUploadComplete,
            recipient_user_id: file_metadata.user_id,
            title: "File Upload Complete".to_string(),
            message: format!("Your file '{}' has been successfully uploaded and is ready for use.", file_metadata.filename),
            data: serde_json::json!({
                "file_id": file_metadata.id,
                "version_id": version.id,
                "filename": file_metadata.filename,
                "file_size": version.file_size,
                "version_number": version.version_number,
                "commit_hash": version.commit_hash
            }),
            channels: vec![NotificationChannel::InApp, NotificationChannel::Push],
            created_at: Utc::now(),
            scheduled_at: None,
        };

        let message = EventMessage::new(
            "notification".to_string(),
            "file-service".to_string(),
            notification,
        ).with_correlation_id(file_metadata.id);

        let message_id = self.sns_service.publish_event(&message).await
            .map_err(|e| anyhow::anyhow!("Failed to publish upload notification: {}", e))?;

        info!("Published upload complete notification for file {} with message ID: {}", file_metadata.id, message_id);
        Ok(message_id)
    }

    pub async fn publish_processing_complete_notification(
        &self,
        file_metadata: &FileMetadata,
        version: &FileVersion,
        processing_results: serde_json::Value,
    ) -> Result<String> {
        let notification = NotificationEvent {
            notification_id: Uuid::new_v4(),
            notification_type: NotificationType::FileProcessingComplete,
            recipient_user_id: file_metadata.user_id,
            title: "File Processing Complete".to_string(),
            message: format!("Processing for your file '{}' has been completed.", file_metadata.filename),
            data: serde_json::json!({
                "file_id": file_metadata.id,
                "version_id": version.id,
                "filename": file_metadata.filename,
                "processing_results": processing_results
            }),
            channels: vec![NotificationChannel::InApp],
            created_at: Utc::now(),
            scheduled_at: None,
        };

        let message = EventMessage::new(
            "notification".to_string(),
            "file-service".to_string(),
            notification,
        ).with_correlation_id(file_metadata.id);

        let message_id = self.sns_service.publish_event(&message).await
            .map_err(|e| anyhow::anyhow!("Failed to publish processing notification: {}", e))?;

        info!("Published processing complete notification for file {} with message ID: {}", file_metadata.id, message_id);
        Ok(message_id)
    }

    pub async fn publish_error_notification(
        &self,
        file_metadata: &FileMetadata,
        error_message: &str,
        error_context: serde_json::Value,
    ) -> Result<String> {
        let notification = NotificationEvent {
            notification_id: Uuid::new_v4(),
            notification_type: NotificationType::FileProcessingFailed,
            recipient_user_id: file_metadata.user_id,
            title: "File Processing Failed".to_string(),
            message: format!("There was an error processing your file '{}': {}", file_metadata.filename, error_message),
            data: serde_json::json!({
                "file_id": file_metadata.id,
                "filename": file_metadata.filename,
                "error": error_message,
                "context": error_context
            }),
            channels: vec![NotificationChannel::InApp, NotificationChannel::Email],
            created_at: Utc::now(),
            scheduled_at: None,
        };

        let message = EventMessage::new(
            "notification".to_string(),
            "file-service".to_string(),
            notification,
        ).with_correlation_id(file_metadata.id);

        let message_id = self.sns_service.publish_event(&message).await
            .map_err(|e| anyhow::anyhow!("Failed to publish error notification: {}", e))?;

        warn!("Published error notification for file {} with message ID: {}", file_metadata.id, message_id);
        Ok(message_id)
    }

    pub async fn publish_file_deleted_event(
        &self,
        file_metadata: &FileMetadata,
    ) -> Result<String> {
        let file_event = FileEvent {
            event_type: FileEventType::FileDeleted,
            file_id: file_metadata.id,
            user_id: file_metadata.user_id,
            file_name: file_metadata.filename.clone(),
            file_size: None,
            content_type: Some(file_metadata.content_type.clone()),
            s3_key: None,
            version_id: None,
            commit_hash: None,
            metadata: serde_json::json!({
                "deleted_at": Utc::now(),
                "total_versions": file_metadata.total_versions,
                "total_size": file_metadata.total_size
            }),
            timestamp: Utc::now(),
        };

        let message = EventMessage::new(
            "file_deleted".to_string(),
            "file-service".to_string(),
            file_event,
        ).with_correlation_id(file_metadata.id);

        let message_id = self.sns_service.publish_event(&message).await
            .map_err(|e| anyhow::anyhow!("Failed to publish file deleted event: {}", e))?;

        info!("Published file deleted event for file {} with message ID: {}", file_metadata.id, message_id);
        Ok(message_id)
    }

    fn determine_job_priority(&self, content_type: &str) -> JobPriority {
        match content_type {
            ct if ct.starts_with("image/") => JobPriority::High,
            ct if ct.starts_with("video/") => JobPriority::Medium,
            ct if ct.starts_with("audio/") => JobPriority::Medium,
            "application/pdf" => JobPriority::High,
            _ => JobPriority::Low,
        }
    }

    pub async fn publish_bulk_processing_jobs(
        &self,
        jobs: Vec<(FileMetadata, FileVersion, ProcessingJobType, serde_json::Value)>,
    ) -> Result<Vec<String>> {
        let mut message_ids = Vec::new();

        let jobs_count = jobs.len();
        for (file_metadata, version, job_type, parameters) in jobs {
            match self.publish_processing_job(&file_metadata, &version, job_type, parameters).await {
                Ok(message_id) => message_ids.push(message_id),
                Err(e) => {
                    error!("Failed to publish processing job for file {}: {}", file_metadata.id, e);
                    // Continue with other jobs even if one fails
                }
            }
        }

        info!("Published {} out of {} processing jobs", message_ids.len(), jobs_count);
        Ok(message_ids)
    }

    pub async fn health_check(&self) -> Result<bool> {
        // Try to publish a test message
        match self.sns_service.publish_raw_message(
            "Health Check",
            &serde_json::json!({
                "service": "file-service",
                "timestamp": Utc::now(),
                "health_check": true
            }).to_string(),
            None,
        ).await {
            Ok(_) => {
                info!("Messaging service health check passed");
                Ok(true)
            }
            Err(e) => {
                error!("Messaging service health check failed: {}", e);
                Ok(false)
            }
        }
    }
}