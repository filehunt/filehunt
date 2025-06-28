use anyhow::Result;
use aws_config::meta::region::RegionProviderChain;
use aws_sdk_sqs::{types::Message, Client};
use serde::{Deserialize, Serialize};
use std::env;
use std::time::Duration;
use tokio::time::sleep;
use tracing::{error, info, warn, debug, Level};
use chrono::{DateTime, Utc};
use uuid::Uuid;

// Use the correct structures from shared-rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct EventMessage<T> {
    pub message_id: Uuid,
    pub event_type: String,
    pub source: String,
    pub data: T,
    pub timestamp: DateTime<Utc>,
    pub correlation_id: Option<Uuid>,
    pub retry_count: u32,
}

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

pub type FileEventMessage = EventMessage<FileEvent>;

#[derive(Debug, Deserialize)]
struct SqsNotificationMessage {
    #[serde(rename = "Type")]
    message_type: String,
    #[serde(rename = "Message")]
    message: String,
    #[serde(rename = "MessageAttributes")]
    message_attributes: Option<serde_json::Value>,
}

struct FileWorker {
    sqs_client: Client,
    queue_url: String,
}

impl FileWorker {
    async fn new() -> Result<Self> {
        let region_provider = RegionProviderChain::default_provider()
            .or_else("us-east-1");
        
        let mut config_builder = aws_config::from_env().region(region_provider);
        
        if let Ok(endpoint) = env::var("SQS_ENDPOINT") {
            config_builder = config_builder.endpoint_url(endpoint);
        }
        
        let config = config_builder.load().await;
        let sqs_client = Client::new(&config);
        
        let queue_url = env::var("QUEUE_URL_FILE_PROCESSING")
            .unwrap_or_else(|_| {
                "http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/file-processing-queue".to_string()
            });

        Ok(FileWorker {
            sqs_client,
            queue_url,
        })
    }

    async fn start_polling(&self) -> Result<()> {
        info!("Starting SQS polling for file-processing-queue");
        
        loop {
            match self.poll_messages().await {
                Ok(_) => {
                    // Continue polling
                }
                Err(e) => {
                    error!("Error during polling: {}", e);
                    sleep(Duration::from_secs(5)).await;
                }
            }
        }
    }

    async fn poll_messages(&self) -> Result<()> {
        let receive_message_output = self
            .sqs_client
            .receive_message()
            .queue_url(&self.queue_url)
            .max_number_of_messages(10)
            .wait_time_seconds(20)
            .message_attribute_names("All")
            .send()
            .await?;

        if let Some(messages) = receive_message_output.messages {
            if !messages.is_empty() {
                info!("Received {} message(s) from file-processing-queue", messages.len());
                
                for message in messages {
                    self.process_message(message).await;
                }
            }
        }

        Ok(())
    }

    async fn process_message(&self, message: Message) {
        let message_id = message.message_id().unwrap_or("unknown");
        debug!("Processing message: {}", message_id);

        match self.parse_message(&message) {
            Ok(Some(event)) => {
                match self.process_file_event(event).await {
                    Ok(_) => {
                        // Delete message after successful processing
                        if let Some(receipt_handle) = message.receipt_handle() {
                            if let Err(e) = self.delete_message(receipt_handle).await {
                                error!("Failed to delete message {}: {}", message_id, e);
                            } else {
                                info!("Successfully processed message: {}", message_id);
                            }
                        }
                    }
                    Err(e) => {
                        error!("Error processing file event for message {}: {}", message_id, e);
                        // Message will be retried automatically due to SQS visibility timeout
                    }
                }
            }
            Ok(None) => {
                warn!("Failed to parse message: {}", message_id);
                // Delete invalid message to prevent reprocessing
                if let Some(receipt_handle) = message.receipt_handle() {
                    if let Err(e) = self.delete_message(receipt_handle).await {
                        error!("Failed to delete invalid message {}: {}", message_id, e);
                    }
                }
            }
            Err(e) => {
                error!("Error parsing message {}: {}", message_id, e);
            }
        }
    }

    fn parse_message(&self, message: &Message) -> Result<Option<FileEvent>> {
        let body = message.body().ok_or_else(|| anyhow::anyhow!("Message body is empty"))?;
        
        let sqs_message: SqsNotificationMessage = serde_json::from_str(body)?;
        
        if sqs_message.message_type != "Notification" {
            warn!("Message is not a notification type");
            return Ok(None);
        }

        // Parse as EventMessage<FileEvent>
        let event_message: FileEventMessage = serde_json::from_str(&sqs_message.message)?;
        
        if event_message.event_type != "file_uploaded" {
            warn!("Unsupported event type: {}", event_message.event_type);
            return Ok(None);
        }

        let file_event = event_message.data;
        
        if !matches!(file_event.event_type, FileEventType::FileUploaded) {
            warn!("Unsupported file event type: {:?}", file_event.event_type);
            return Ok(None);
        }

        Ok(Some(file_event))
    }

    async fn process_file_event(&self, event: FileEvent) -> Result<()> {
        let content_type = event.content_type.as_deref().unwrap_or("unknown");
        let file_name = &event.file_name;
        let file_size = event.file_size.unwrap_or(0);
        
        info!("Processing {} file: {} (ID: {})", content_type, file_name, event.file_id);
        
        // Determine processing type based on content type
        let processing_message = match content_type {
            ct if ct.starts_with("image/") => {
                "Generating thumbnail..."
            }
            ct if ct.starts_with("video/") => {
                "Processing video..."
            }
            "application/pdf" => {
                "Extracting text..."
            }
            _ => {
                "Basic processing..."
            }
        };
        
        info!("{} for file: {} (ID: {})", processing_message, file_name, event.file_id);
        
        // Log additional information from the event
        if let Some(s3_key) = &event.s3_key {
            info!("S3 Key: {}", s3_key);
        }
        if let Some(version_id) = &event.version_id {
            info!("Version ID: {}", version_id);
        }
        if let Some(commit_hash) = &event.commit_hash {
            info!("Commit Hash: {}", commit_hash);
        }
        
        // Simulate processing time based on file type
        let processing_duration = match content_type {
            ct if ct.starts_with("image/") => Duration::from_millis(500),
            ct if ct.starts_with("video/") => Duration::from_secs(2),
            "application/pdf" => Duration::from_secs(1),
            _ => Duration::from_millis(200),
        };
        
        sleep(processing_duration).await;
        
        info!("Completed processing for file: {} (Size: {} bytes)", file_name, file_size);
        
        Ok(())
    }

    async fn delete_message(&self, receipt_handle: &str) -> Result<()> {
        self.sqs_client
            .delete_message()
            .queue_url(&self.queue_url)
            .receipt_handle(receipt_handle)
            .send()
            .await?;
        
        debug!("Message deleted successfully");
        Ok(())
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize tracing
    tracing_subscriber::fmt()
        .with_max_level(Level::INFO)
        .with_env_filter(tracing_subscriber::EnvFilter::from_default_env())
        .init();

    info!("Starting File Worker...");

    // Set default AWS credentials for LocalStack if not provided
    if env::var("AWS_ACCESS_KEY_ID").is_err() {
        env::set_var("AWS_ACCESS_KEY_ID", "test");
    }
    if env::var("AWS_SECRET_ACCESS_KEY").is_err() {
        env::set_var("AWS_SECRET_ACCESS_KEY", "test");
    }
    if env::var("AWS_DEFAULT_REGION").is_err() {
        env::set_var("AWS_DEFAULT_REGION", "us-east-1");
    }

    let worker = FileWorker::new().await?;
    
    // Handle graceful shutdown
    let (tx, mut rx) = tokio::sync::mpsc::channel::<()>(1);
    
    tokio::spawn(async move {
        tokio::signal::ctrl_c().await.expect("Failed to listen for Ctrl+C");
        info!("Received Ctrl+C, shutting down gracefully...");
        let _ = tx.send(()).await;
    });

    tokio::select! {
        result = worker.start_polling() => {
            match result {
                Ok(_) => info!("File Worker stopped normally"),
                Err(e) => error!("File Worker stopped with error: {}", e),
            }
        }
        _ = rx.recv() => {
            info!("File Worker shutting down...");
        }
    }

    info!("File Worker stopped");
    Ok(())
}