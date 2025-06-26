use anyhow::Result;
use redis::{Client, Commands};
use serde_json;
use tracing::{error, info};
use uuid::Uuid;

use crate::models::FileMetadata;

#[derive(Clone)]
pub struct CacheService {
    client: Client,
}

impl CacheService {
    pub async fn new(redis_url: &str) -> Result<Self> {
        let client = Client::open(redis_url)?;
        
        // Test connection
        let mut conn = client.get_connection()?;
        let _: String = redis::cmd("PING").query(&mut conn)?;
        
        info!("Connected to Redis cache");
        Ok(Self { client })
    }

    pub async fn set_file_metadata(&self, file_id: Uuid, metadata: &FileMetadata) -> Result<()> {
        let mut conn = self.client.get_connection()?;
        let key = format!("file:{}", file_id);
        let value = serde_json::to_string(metadata)?;
        
        let _: () = conn.set_ex(&key, &value, 3600)?; // 1 hour TTL
        
        info!("Cached metadata for file: {}", file_id);
        Ok(())
    }

    pub async fn get_file_metadata(&self, file_id: Uuid) -> Result<Option<FileMetadata>> {
        let mut conn = self.client.get_connection()?;
        let key = format!("file:{}", file_id);
        
        match conn.get::<String, Option<String>>(key)? {
            Some(value) => {
                let metadata: FileMetadata = serde_json::from_str(&value)?;
                Ok(Some(metadata))
            }
            None => Ok(None),
        }
    }

    pub async fn delete_file_metadata(&self, file_id: Uuid) -> Result<()> {
        let mut conn = self.client.get_connection()?;
        let key = format!("file:{}", file_id);
        
        let _: i32 = conn.del(&key)?;
        
        info!("Removed cached metadata for file: {}", file_id);
        Ok(())
    }

    pub async fn set_user_files_cache(&self, user_id: Uuid, files: &[FileMetadata]) -> Result<()> {
        let mut conn = self.client.get_connection()?;
        let key = format!("user:{}:files", user_id);
        let value = serde_json::to_string(files)?;
        
        let _: () = conn.set_ex(&key, &value, 1800)?; // 30 minutes TTL
        
        info!("Cached file list for user: {}", user_id);
        Ok(())
    }

    pub async fn get_user_files_cache(&self, user_id: Uuid) -> Result<Option<Vec<FileMetadata>>> {
        let mut conn = self.client.get_connection()?;
        let key = format!("user:{}:files", user_id);
        
        match conn.get::<String, Option<String>>(key)? {
            Some(value) => {
                let files: Vec<FileMetadata> = serde_json::from_str(&value)?;
                Ok(Some(files))
            }
            None => Ok(None),
        }
    }

    pub async fn invalidate_user_cache(&self, user_id: Uuid) -> Result<()> {
        let mut conn = self.client.get_connection()?;
        let pattern = format!("user:{}:*", user_id);
        
        let keys: Vec<String> = conn.keys(&pattern)?;
        if !keys.is_empty() {
            let _: i32 = conn.del(&keys)?;
            info!("Invalidated cache for user: {}", user_id);
        }
        
        Ok(())
    }

    pub async fn set_presigned_url(&self, file_id: Uuid, url: &str, expires_in: u64) -> Result<()> {
        let mut conn = self.client.get_connection()?;
        let key = format!("presigned:{}", file_id);
        
        let _: () = conn.set_ex(&key, url, expires_in)?;
        
        info!("Cached presigned URL for file: {}", file_id);
        Ok(())
    }

    pub async fn get_presigned_url(&self, file_id: Uuid) -> Result<Option<String>> {
        let mut conn = self.client.get_connection()?;
        let key = format!("presigned:{}", file_id);
        
        let url: Option<String> = conn.get(&key)?;
        Ok(url)
    }

    pub async fn set_file_stats(&self, user_id: Option<Uuid>, stats: &serde_json::Value) -> Result<()> {
        let mut conn = self.client.get_connection()?;
        let key = if let Some(user_id) = user_id {
            format!("stats:user:{}", user_id)
        } else {
            "stats:global".to_string()
        };
        
        let value = serde_json::to_string(stats)?;
        let _: () = conn.set_ex(&key, &value, 300)?; // 5 minutes TTL
        
        info!("Cached file stats");
        Ok(())
    }

    pub async fn get_file_stats(&self, user_id: Option<Uuid>) -> Result<Option<serde_json::Value>> {
        let mut conn = self.client.get_connection()?;
        let key = if let Some(user_id) = user_id {
            format!("stats:user:{}", user_id)
        } else {
            "stats:global".to_string()
        };
        
        match conn.get::<String, Option<String>>(key)? {
            Some(value) => {
                let stats: serde_json::Value = serde_json::from_str(&value)?;
                Ok(Some(stats))
            }
            None => Ok(None),
        }
    }

    pub async fn health_check(&self) -> Result<bool> {
        match self.client.get_connection() {
            Ok(mut conn) => {
                match redis::cmd("PING").query::<String>(&mut conn) {
                    Ok(_) => Ok(true),
                    Err(err) => {
                        error!("Redis health check failed: {}", err);
                        Ok(false)
                    }
                }
            }
            Err(err) => {
                error!("Redis connection failed: {}", err);
                Ok(false)
            }
        }
    }
}