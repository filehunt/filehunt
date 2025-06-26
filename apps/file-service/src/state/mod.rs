use std::sync::Arc;
use anyhow::Result;

use crate::config::Config;
use crate::services::{FileS3Service, MessagingService, GitService, DatabaseService, CacheService};

#[derive(Clone)]
pub struct AppState {
    pub config: Config,
    pub s3_service: Arc<FileS3Service>,
    pub messaging_service: Arc<MessagingService>,
    pub git_service: Arc<GitService>,
    pub database_service: Arc<DatabaseService>,
    pub cache_service: Arc<CacheService>,
}

impl AppState {
    pub async fn new(config: Config) -> Result<Self> {
        // Initialize all services
        let s3_service = Arc::new(FileS3Service::new(&config).await?);
        let messaging_service = Arc::new(MessagingService::new(&config).await?);
        let git_service = Arc::new(GitService::new(&config));
        let database_service = Arc::new(DatabaseService::new(&config.database_url).await?);
        let cache_service = Arc::new(CacheService::new(&config.redis_url).await?);

        Ok(Self {
            config,
            s3_service,
            messaging_service,
            git_service,
            database_service,
            cache_service,
        })
    }

    pub async fn health_check(&self) -> serde_json::Value {
        let git_healthy = self.git_service.health_check().await.unwrap_or(false);
        let cache_healthy = self.cache_service.health_check().await.unwrap_or(false);
        let messaging_healthy = self.messaging_service.health_check().await.unwrap_or(false);
        
        serde_json::json!({
            "status": "healthy",
            "services": {
                "git_service": git_healthy,
                "cache": cache_healthy,
                "messaging": messaging_healthy,
                "database": true, // TODO: Add database health check
                "s3": true, // TODO: Add S3 health check
            }
        })
    }
}