use aws_sdk_sqs::{Client as SqsClient, types::QueueAttributeName};
use aws_credential_types::Credentials;
use aws_types::region::Region;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use super::config::MessagingConfig;
use super::{EventMessage, MessagingError, Result};

#[derive(Clone)]
pub struct SqsService {
    client: SqsClient,
}

impl SqsService {
    pub fn new(client: SqsClient) -> Self {
        Self { client }
    }

    pub async fn from_config(config: &MessagingConfig) -> Result<Self> {
        let credentials = Credentials::new(
            &config.access_key_id,
            &config.secret_access_key,
            None,
            None,
            "shared-rust-sqs",
        );

        let mut config_builder = aws_sdk_sqs::Config::builder()
            .region(Region::new(config.region.clone()))
            .credentials_provider(credentials);

        if let Some(endpoint) = &config.endpoint {
            config_builder = config_builder.endpoint_url(endpoint);
        }

        let sqs_config = config_builder.build();
        let client = SqsClient::from_conf(sqs_config);

        Ok(Self::new(client))
    }

    pub async fn send_message<T: Serialize>(
        &self,
        queue_url: &str,
        message: &EventMessage<T>,
        message_group_id: Option<&str>,
        deduplication_id: Option<&str>,
    ) -> Result<String> {
        let message_body = serde_json::to_string(message)
            .map_err(MessagingError::SerializationError)?;

        let mut send_builder = self
            .client
            .send_message()
            .queue_url(queue_url)
            .message_body(&message_body);

        // Add message attributes
        let mut attributes = HashMap::new();
        attributes.insert(
            "event_type".to_string(),
            aws_sdk_sqs::types::MessageAttributeValue::builder()
                .data_type("String")
                .string_value(&message.event_type)
                .build()
                .map_err(|e| MessagingError::SqsError(format!("Failed to build attribute: {}", e)))?,
        );

        attributes.insert(
            "source".to_string(),
            aws_sdk_sqs::types::MessageAttributeValue::builder()
                .data_type("String")
                .string_value(&message.source)
                .build()
                .map_err(|e| MessagingError::SqsError(format!("Failed to build attribute: {}", e)))?,
        );

        if let Some(correlation_id) = &message.correlation_id {
            attributes.insert(
                "correlation_id".to_string(),
                aws_sdk_sqs::types::MessageAttributeValue::builder()
                    .data_type("String")
                    .string_value(&correlation_id.to_string())
                    .build()
                    .map_err(|e| MessagingError::SqsError(format!("Failed to build attribute: {}", e)))?,
            );
        }

        send_builder = send_builder.set_message_attributes(Some(attributes));

        // For FIFO queues
        if let Some(group_id) = message_group_id {
            send_builder = send_builder.message_group_id(group_id);
        }

        if let Some(dedup_id) = deduplication_id {
            send_builder = send_builder.message_deduplication_id(dedup_id);
        }

        let response = send_builder
            .send()
            .await
            .map_err(|e| MessagingError::SqsError(format!("Failed to send message: {}", e)))?;

        Ok(response.message_id().unwrap_or("unknown").to_string())
    }

    pub async fn send_raw_message(
        &self,
        queue_url: &str,
        message_body: &str,
        message_group_id: Option<&str>,
        deduplication_id: Option<&str>,
        attributes: Option<HashMap<String, String>>,
    ) -> Result<String> {
        let mut send_builder = self
            .client
            .send_message()
            .queue_url(queue_url)
            .message_body(message_body);

        if let Some(attrs) = attributes {
            let mut message_attributes = HashMap::new();
            for (key, value) in attrs {
                message_attributes.insert(
                    key,
                    aws_sdk_sqs::types::MessageAttributeValue::builder()
                        .data_type("String")
                        .string_value(value)
                        .build()
                        .map_err(|e| MessagingError::SqsError(format!("Failed to build attribute: {}", e)))?,
                );
            }
            send_builder = send_builder.set_message_attributes(Some(message_attributes));
        }

        // For FIFO queues
        if let Some(group_id) = message_group_id {
            send_builder = send_builder.message_group_id(group_id);
        }

        if let Some(dedup_id) = deduplication_id {
            send_builder = send_builder.message_deduplication_id(dedup_id);
        }

        let response = send_builder
            .send()
            .await
            .map_err(|e| MessagingError::SqsError(format!("Failed to send raw message: {}", e)))?;

        Ok(response.message_id().unwrap_or("unknown").to_string())
    }

    pub async fn receive_messages(
        &self,
        queue_url: &str,
        max_messages: Option<i32>,
        wait_time_seconds: Option<i32>,
    ) -> Result<Vec<aws_sdk_sqs::types::Message>> {
        let mut receive_builder = self
            .client
            .receive_message()
            .queue_url(queue_url)
            .message_attribute_names("All");

        if let Some(max_msgs) = max_messages {
            receive_builder = receive_builder.max_number_of_messages(max_msgs);
        }

        if let Some(wait_time) = wait_time_seconds {
            receive_builder = receive_builder.wait_time_seconds(wait_time);
        }

        let response = receive_builder
            .send()
            .await
            .map_err(|e| MessagingError::SqsError(format!("Failed to receive messages: {}", e)))?;

        Ok(response.messages().to_vec())
    }

    pub async fn delete_message(&self, queue_url: &str, receipt_handle: &str) -> Result<()> {
        self.client
            .delete_message()
            .queue_url(queue_url)
            .receipt_handle(receipt_handle)
            .send()
            .await
            .map_err(|e| MessagingError::SqsError(format!("Failed to delete message: {}", e)))?;

        Ok(())
    }

    pub async fn create_queue(
        &self,
        queue_name: &str,
        is_fifo: bool,
        attributes: Option<HashMap<String, String>>,
    ) -> Result<String> {
        let mut create_builder = self.client.create_queue().queue_name(queue_name);

        let mut queue_attributes = HashMap::new();

        if is_fifo {
            queue_attributes.insert(QueueAttributeName::FifoQueue, "true".to_string());
            queue_attributes.insert(QueueAttributeName::ContentBasedDeduplication, "false".to_string());
        }

        if let Some(attrs) = attributes {
            for (key, value) in attrs {
                let attr_name = key.parse::<QueueAttributeName>().unwrap_or(QueueAttributeName::VisibilityTimeout);
                queue_attributes.insert(attr_name, value);
            }
        }

        if !queue_attributes.is_empty() {
            create_builder = create_builder.set_attributes(Some(queue_attributes));
        }

        let response = create_builder
            .send()
            .await
            .map_err(|e| MessagingError::SqsError(format!("Failed to create queue: {}", e)))?;

        Ok(response.queue_url().unwrap_or("unknown").to_string())
    }

    pub async fn get_queue_url(&self, queue_name: &str) -> Result<String> {
        let response = self
            .client
            .get_queue_url()
            .queue_name(queue_name)
            .send()
            .await
            .map_err(|e| MessagingError::SqsError(format!("Failed to get queue URL: {}", e)))?;

        Ok(response.queue_url().unwrap_or("unknown").to_string())
    }

    pub async fn list_queues(&self, prefix: Option<&str>) -> Result<Vec<String>> {
        let mut list_builder = self.client.list_queues();

        if let Some(queue_prefix) = prefix {
            list_builder = list_builder.queue_name_prefix(queue_prefix);
        }

        let response = list_builder
            .send()
            .await
            .map_err(|e| MessagingError::SqsError(format!("Failed to list queues: {}", e)))?;

        Ok(response.queue_urls().to_vec())
    }

    pub fn parse_event_message<T>(&self, message: &aws_sdk_sqs::types::Message) -> Result<EventMessage<T>>
    where
        T: for<'de> Deserialize<'de>,
    {
        let body = message
            .body()
            .ok_or_else(|| MessagingError::SqsError("Message has no body".to_string()))?;

        serde_json::from_str(body).map_err(MessagingError::SerializationError)
    }
}