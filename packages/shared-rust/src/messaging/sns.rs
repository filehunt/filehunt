use aws_sdk_sns::{Client as SnsClient, types::MessageAttributeValue};
use aws_credential_types::Credentials;
use aws_types::region::Region;
use serde::Serialize;
use std::collections::HashMap;

use super::config::MessagingConfig;
use super::{EventMessage, MessagingError, Result};

#[derive(Clone)]
pub struct SnsService {
    client: SnsClient,
    topic_arn: String,
}

impl SnsService {
    pub fn new(client: SnsClient, topic_arn: String) -> Self {
        Self { client, topic_arn }
    }

    pub async fn from_config(config: &MessagingConfig) -> Result<Self> {
        let credentials = Credentials::new(
            &config.access_key_id,
            &config.secret_access_key,
            None,
            None,
            "shared-rust-sns",
        );

        let mut config_builder = aws_sdk_sns::Config::builder()
            .region(Region::new(config.region.clone()))
            .credentials_provider(credentials);

        if let Some(endpoint) = &config.endpoint {
            config_builder = config_builder.endpoint_url(endpoint);
        }

        let sns_config = config_builder.build();
        let client = SnsClient::from_conf(sns_config);

        Ok(Self::new(client, config.sns_topic_arn.clone()))
    }

    pub async fn publish_event<T: Serialize>(
        &self,
        message: &EventMessage<T>,
    ) -> Result<String> {
        let message_body = serde_json::to_string(message)
            .map_err(MessagingError::SerializationError)?;

        let mut attributes = HashMap::new();
        
        // Add message attributes for filtering
        attributes.insert(
            "event_type".to_string(),
            MessageAttributeValue::builder()
                .data_type("String")
                .string_value(&message.event_type)
                .build()
                .map_err(|e| MessagingError::SnsError(format!("Failed to build attribute: {}", e)))?
        );

        attributes.insert(
            "source".to_string(),
            MessageAttributeValue::builder()
                .data_type("String")
                .string_value(&message.source)
                .build()
                .map_err(|e| MessagingError::SnsError(format!("Failed to build attribute: {}", e)))?
        );

        if let Some(correlation_id) = &message.correlation_id {
            attributes.insert(
                "correlation_id".to_string(),
                MessageAttributeValue::builder()
                    .data_type("String")
                    .string_value(&correlation_id.to_string())
                    .build()
                    .map_err(|e| MessagingError::SnsError(format!("Failed to build attribute: {}", e)))?
            );
        }

        attributes.insert(
            "timestamp".to_string(),
            MessageAttributeValue::builder()
                .data_type("String")
                .string_value(&message.timestamp.to_rfc3339())
                .build()
                .map_err(|e| MessagingError::SnsError(format!("Failed to build attribute: {}", e)))?
        );

        let response = self
            .client
            .publish()
            .topic_arn(&self.topic_arn)
            .message(&message_body)
            .subject(&format!("Event: {}", message.event_type))
            .set_message_attributes(Some(attributes))
            .send()
            .await
            .map_err(|e| MessagingError::SnsError(format!("Failed to publish message: {}", e)))?;

        Ok(response.message_id().unwrap_or("unknown").to_string())
    }

    pub async fn publish_raw_message(
        &self,
        subject: &str,
        message: &str,
        attributes: Option<HashMap<String, String>>,
    ) -> Result<String> {
        let mut message_attributes = HashMap::new();

        if let Some(attrs) = attributes {
            for (key, value) in attrs {
                message_attributes.insert(
                    key,
                    MessageAttributeValue::builder()
                        .data_type("String")
                        .string_value(value)
                        .build()
                        .map_err(|e| MessagingError::SnsError(format!("Failed to build attribute: {}", e)))?
                );
            }
        }

        let response = self
            .client
            .publish()
            .topic_arn(&self.topic_arn)
            .message(message)
            .subject(subject)
            .set_message_attributes(if message_attributes.is_empty() {
                None
            } else {
                Some(message_attributes)
            })
            .send()
            .await
            .map_err(|e| MessagingError::SnsError(format!("Failed to publish raw message: {}", e)))?;

        Ok(response.message_id().unwrap_or("unknown").to_string())
    }

    pub async fn create_topic_if_not_exists(&self, topic_name: &str) -> Result<String> {
        let response = self
            .client
            .create_topic()
            .name(topic_name)
            .send()
            .await
            .map_err(|e| MessagingError::SnsError(format!("Failed to create topic: {}", e)))?;

        Ok(response.topic_arn().unwrap_or("unknown").to_string())
    }

    pub async fn subscribe_sqs_queue(&self, queue_arn: &str, filter_policy: Option<String>) -> Result<String> {
        let mut subscription_builder = self
            .client
            .subscribe()
            .topic_arn(&self.topic_arn)
            .protocol("sqs")
            .endpoint(queue_arn);

        if let Some(policy) = filter_policy {
            let mut attributes = HashMap::new();
            attributes.insert("FilterPolicy".to_string(), policy);
            subscription_builder = subscription_builder.set_attributes(Some(attributes));
        }

        let response = subscription_builder
            .send()
            .await
            .map_err(|e| MessagingError::SnsError(format!("Failed to subscribe queue: {}", e)))?;

        Ok(response.subscription_arn().unwrap_or("unknown").to_string())
    }
}