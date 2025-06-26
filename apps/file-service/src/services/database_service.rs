use anyhow::Result;
use chrono::Utc;
use sqlx::{PgPool, Row};
use uuid::Uuid;
use tracing::info;

use crate::models::{FileMetadata, FileVersion, FileStatus, VersionStatus, ListFilesQuery, ListVersionsQuery, FileStatsResponse};

#[derive(Clone)]
pub struct DatabaseService {
    pool: PgPool,
}

impl DatabaseService {
    pub async fn new(database_url: &str) -> Result<Self> {
        let pool = PgPool::connect(database_url).await?;
        Ok(Self { pool })
    }

    // File metadata operations
    pub async fn create_file_metadata(&self, metadata: &FileMetadata) -> Result<()> {
        sqlx::query(
            r#"
            INSERT INTO file_metadata (
                id, user_id, filename, original_filename, content_type,
                tags, status, current_version_id, total_versions, total_size,
                created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            "#
        )
        .bind(metadata.id)
        .bind(metadata.user_id)
        .bind(&metadata.filename)
        .bind(&metadata.original_filename)
        .bind(&metadata.content_type)
        .bind(&metadata.tags)
        .bind(metadata.status)
        .bind(metadata.current_version_id)
        .bind(metadata.total_versions)
        .bind(metadata.total_size)
        .bind(metadata.created_at)
        .bind(metadata.updated_at)
        .execute(&self.pool)
        .await?;

        info!("Created file metadata for file: {}", metadata.id);
        Ok(())
    }

    pub async fn get_file_metadata(&self, file_id: Uuid) -> Result<Option<FileMetadata>> {
        let row = sqlx::query("SELECT * FROM file_metadata WHERE id = $1")
            .bind(file_id)
            .fetch_optional(&self.pool)
            .await?;

        match row {
            Some(row) => {
                let metadata = FileMetadata {
                    id: row.get("id"),
                    user_id: row.get("user_id"),
                    filename: row.get("filename"),
                    original_filename: row.get("original_filename"),
                    content_type: row.get("content_type"),
                    tags: row.get("tags"),
                    status: row.get("status"),
                    current_version_id: row.get("current_version_id"),
                    total_versions: row.get("total_versions"),
                    total_size: row.get("total_size"),
                    created_at: row.get("created_at"),
                    updated_at: row.get("updated_at"),
                };
                Ok(Some(metadata))
            }
            None => Ok(None),
        }
    }

    pub async fn update_file_metadata(&self, file_id: Uuid, filename: Option<String>, tags: Option<serde_json::Value>) -> Result<()> {
        let mut query_parts = Vec::new();
        let mut param_count = 1;

        if filename.is_some() {
            query_parts.push(format!("filename = ${}", param_count));
            param_count += 1;
        }

        if tags.is_some() {
            query_parts.push(format!("tags = ${}", param_count));
            param_count += 1;
        }

        query_parts.push(format!("updated_at = ${}", param_count));

        let query_str = format!("UPDATE file_metadata SET {} WHERE id = ${}", query_parts.join(", "), param_count + 1);
        let mut query = sqlx::query(&query_str);

        if let Some(fname) = filename {
            query = query.bind(fname);
        }
        if let Some(t) = tags {
            query = query.bind(t);
        }

        query = query.bind(Utc::now()).bind(file_id);
        query.execute(&self.pool).await?;

        info!("Updated file metadata for file: {}", file_id);
        Ok(())
    }

    pub async fn update_file_status(&self, file_id: Uuid, status: FileStatus) -> Result<()> {
        sqlx::query("UPDATE file_metadata SET status = $1, updated_at = $2 WHERE id = $3")
            .bind(status)
            .bind(Utc::now())
            .bind(file_id)
            .execute(&self.pool)
            .await?;

        info!("Updated file {} status to {:?}", file_id, status);
        Ok(())
    }

    pub async fn delete_file_metadata(&self, file_id: Uuid) -> Result<()> {
        sqlx::query("UPDATE file_metadata SET status = $1, updated_at = $2 WHERE id = $3")
            .bind(FileStatus::Deleted)
            .bind(Utc::now())
            .bind(file_id)
            .execute(&self.pool)
            .await?;

        info!("Marked file {} as deleted", file_id);
        Ok(())
    }

    // File version operations
    pub async fn create_file_version(&self, version: &FileVersion) -> Result<()> {
        sqlx::query(
            r#"
            INSERT INTO file_versions (
                id, file_id, version_number, s3_key, s3_bucket, file_size,
                file_hash, commit_hash, commit_message, created_by, parent_version_id,
                status, processing_metadata, created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            "#
        )
        .bind(version.id)
        .bind(version.file_id)
        .bind(version.version_number)
        .bind(&version.s3_key)
        .bind(&version.s3_bucket)
        .bind(version.file_size)
        .bind(&version.file_hash)
        .bind(&version.commit_hash)
        .bind(&version.commit_message)
        .bind(version.created_by)
        .bind(version.parent_version_id)
        .bind(version.status)
        .bind(&version.processing_metadata)
        .bind(version.created_at)
        .execute(&self.pool)
        .await?;

        info!("Created file version {} for file {}", version.id, version.file_id);
        Ok(())
    }

    pub async fn get_file_version(&self, version_id: Uuid) -> Result<Option<FileVersion>> {
        let row = sqlx::query("SELECT * FROM file_versions WHERE id = $1")
            .bind(version_id)
            .fetch_optional(&self.pool)
            .await?;

        match row {
            Some(row) => {
                let version = FileVersion {
                    id: row.get("id"),
                    file_id: row.get("file_id"),
                    version_number: row.get("version_number"),
                    s3_key: row.get("s3_key"),
                    s3_bucket: row.get("s3_bucket"),
                    file_size: row.get("file_size"),
                    file_hash: row.get("file_hash"),
                    commit_hash: row.get("commit_hash"),
                    commit_message: row.get("commit_message"),
                    created_by: row.get("created_by"),
                    parent_version_id: row.get("parent_version_id"),
                    status: row.get("status"),
                    processing_metadata: row.get("processing_metadata"),
                    created_at: row.get("created_at"),
                };
                Ok(Some(version))
            }
            None => Ok(None),
        }
    }

    pub async fn get_latest_file_version(&self, file_id: Uuid) -> Result<Option<FileVersion>> {
        let row = sqlx::query("SELECT * FROM file_versions WHERE file_id = $1 ORDER BY version_number DESC LIMIT 1")
            .bind(file_id)
            .fetch_optional(&self.pool)
            .await?;

        match row {
            Some(row) => {
                let version = FileVersion {
                    id: row.get("id"),
                    file_id: row.get("file_id"),
                    version_number: row.get("version_number"),
                    s3_key: row.get("s3_key"),
                    s3_bucket: row.get("s3_bucket"),
                    file_size: row.get("file_size"),
                    file_hash: row.get("file_hash"),
                    commit_hash: row.get("commit_hash"),
                    commit_message: row.get("commit_message"),
                    created_by: row.get("created_by"),
                    parent_version_id: row.get("parent_version_id"),
                    status: row.get("status"),
                    processing_metadata: row.get("processing_metadata"),
                    created_at: row.get("created_at"),
                };
                Ok(Some(version))
            }
            None => Ok(None),
        }
    }

    pub async fn get_next_version_number(&self, file_id: Uuid) -> Result<i32> {
        let row = sqlx::query("SELECT COALESCE(MAX(version_number), 0) + 1 as next_version FROM file_versions WHERE file_id = $1")
            .bind(file_id)
            .fetch_one(&self.pool)
            .await?;

        Ok(row.get("next_version"))
    }

    pub async fn update_version_status(&self, version_id: Uuid, status: VersionStatus) -> Result<()> {
        sqlx::query("UPDATE file_versions SET status = $1 WHERE id = $2")
            .bind(status)
            .bind(version_id)
            .execute(&self.pool)
            .await?;

        info!("Updated version {} status to {:?}", version_id, status);
        Ok(())
    }

    pub async fn update_version_commit_hash(&self, version_id: Uuid, commit_hash: &str) -> Result<()> {
        sqlx::query("UPDATE file_versions SET commit_hash = $1 WHERE id = $2")
            .bind(commit_hash)
            .bind(version_id)
            .execute(&self.pool)
            .await?;

        info!("Updated version {} commit hash to {}", version_id, commit_hash);
        Ok(())
    }

    pub async fn update_version_processing_metadata(&self, version_id: Uuid, metadata: serde_json::Value) -> Result<()> {
        sqlx::query("UPDATE file_versions SET processing_metadata = $1 WHERE id = $2")
            .bind(metadata)
            .bind(version_id)
            .execute(&self.pool)
            .await?;

        info!("Updated version {} processing metadata", version_id);
        Ok(())
    }

    pub async fn list_files(&self, query: &ListFilesQuery) -> Result<(Vec<FileMetadata>, i64)> {
        let limit = query.limit.unwrap_or(20).min(100) as i32;
        let offset = (query.page.unwrap_or(1) as i32 - 1) * limit;

        // Simple implementation for now - can be enhanced later
        let (files, total) = if let Some(user_id) = query.user_id {
            let total_row = sqlx::query("SELECT COUNT(*) FROM file_metadata WHERE user_id = $1 AND status != 'deleted'")
                .bind(user_id)
                .fetch_one(&self.pool)
                .await?;
            let total: i64 = total_row.get(0);

            let rows = sqlx::query("SELECT * FROM file_metadata WHERE user_id = $1 AND status != 'deleted' ORDER BY created_at DESC LIMIT $2 OFFSET $3")
                .bind(user_id)
                .bind(limit)
                .bind(offset)
                .fetch_all(&self.pool)
                .await?;

            (self.rows_to_file_metadata(rows), total)
        } else {
            let total_row = sqlx::query("SELECT COUNT(*) FROM file_metadata WHERE status != 'deleted'")
                .fetch_one(&self.pool)
                .await?;
            let total: i64 = total_row.get(0);

            let rows = sqlx::query("SELECT * FROM file_metadata WHERE status != 'deleted' ORDER BY created_at DESC LIMIT $1 OFFSET $2")
                .bind(limit)
                .bind(offset)
                .fetch_all(&self.pool)
                .await?;

            (self.rows_to_file_metadata(rows), total)
        };

        Ok((files, total))
    }

    pub async fn list_file_versions(&self, query: &ListVersionsQuery) -> Result<(Vec<FileVersion>, i64)> {
        let limit = query.limit.unwrap_or(20).min(100) as i32;
        let offset = (query.page.unwrap_or(1) as i32 - 1) * limit;

        let total_row = sqlx::query("SELECT COUNT(*) FROM file_versions WHERE file_id = $1 AND status != 'deleted'")
            .bind(query.file_id)
            .fetch_one(&self.pool)
            .await?;
        let total: i64 = total_row.get(0);

        let rows = sqlx::query("SELECT * FROM file_versions WHERE file_id = $1 AND status != 'deleted' ORDER BY version_number DESC LIMIT $2 OFFSET $3")
            .bind(query.file_id)
            .bind(limit)
            .bind(offset)
            .fetch_all(&self.pool)
            .await?;

        let versions = self.rows_to_file_versions(rows);
        Ok((versions, total))
    }

    pub async fn get_file_stats(&self, user_id: Option<Uuid>) -> Result<FileStatsResponse> {
        let (file_stats, version_stats) = if let Some(user_id) = user_id {
            let file_row = sqlx::query(
                r#"
                SELECT 
                    COUNT(*) as total_files,
                    SUM(total_size) as total_size,
                    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_files,
                    COUNT(CASE WHEN status = 'deleted' THEN 1 END) as deleted_files,
                    COUNT(CASE WHEN status = 'archived' THEN 1 END) as archived_files
                FROM file_metadata 
                WHERE user_id = $1
                "#
            )
            .bind(user_id)
            .fetch_one(&self.pool)
            .await?;

            let version_row = sqlx::query(
                r#"
                SELECT 
                    COUNT(*) as total_versions,
                    COUNT(CASE WHEN status = 'ready' THEN 1 END) as ready_versions,
                    COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_versions,
                    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_versions
                FROM file_versions fv
                JOIN file_metadata fm ON fv.file_id = fm.id
                WHERE fm.user_id = $1 AND fv.status != 'deleted'
                "#
            )
            .bind(user_id)
            .fetch_one(&self.pool)
            .await?;

            (file_row, version_row)
        } else {
            let file_row = sqlx::query(
                r#"
                SELECT 
                    COUNT(*) as total_files,
                    SUM(total_size) as total_size,
                    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_files,
                    COUNT(CASE WHEN status = 'deleted' THEN 1 END) as deleted_files,
                    COUNT(CASE WHEN status = 'archived' THEN 1 END) as archived_files
                FROM file_metadata
                "#
            )
            .fetch_one(&self.pool)
            .await?;

            let version_row = sqlx::query(
                r#"
                SELECT 
                    COUNT(*) as total_versions,
                    COUNT(CASE WHEN status = 'ready' THEN 1 END) as ready_versions,
                    COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_versions,
                    COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_versions
                FROM file_versions
                WHERE status != 'deleted'
                "#
            )
            .fetch_one(&self.pool)
            .await?;

            (file_row, version_row)
        };

        let stats = FileStatsResponse {
            total_files: file_stats.get::<i64, _>("total_files"),
            total_versions: version_stats.get::<i64, _>("total_versions"),
            total_size: file_stats.get::<Option<i64>, _>("total_size").unwrap_or(0),
            files_by_status: serde_json::json!({
                "active": file_stats.get::<i64, _>("active_files"),
                "deleted": file_stats.get::<i64, _>("deleted_files"),
                "archived": file_stats.get::<i64, _>("archived_files")
            }),
            versions_by_status: serde_json::json!({
                "ready": version_stats.get::<i64, _>("ready_versions"),
                "processing": version_stats.get::<i64, _>("processing_versions"),
                "failed": version_stats.get::<i64, _>("failed_versions")
            }),
            storage_by_content_type: serde_json::json!({}), // TODO: Implement content type breakdown
        };

        Ok(stats)
    }

    fn rows_to_file_metadata(&self, rows: Vec<sqlx::postgres::PgRow>) -> Vec<FileMetadata> {
        rows.into_iter()
            .map(|row| FileMetadata {
                id: row.get("id"),
                user_id: row.get("user_id"),
                filename: row.get("filename"),
                original_filename: row.get("original_filename"),
                content_type: row.get("content_type"),
                tags: row.get("tags"),
                status: row.get("status"),
                current_version_id: row.get("current_version_id"),
                total_versions: row.get("total_versions"),
                total_size: row.get("total_size"),
                created_at: row.get("created_at"),
                updated_at: row.get("updated_at"),
            })
            .collect()
    }

    fn rows_to_file_versions(&self, rows: Vec<sqlx::postgres::PgRow>) -> Vec<FileVersion> {
        rows.into_iter()
            .map(|row| FileVersion {
                id: row.get("id"),
                file_id: row.get("file_id"),
                version_number: row.get("version_number"),
                s3_key: row.get("s3_key"),
                s3_bucket: row.get("s3_bucket"),
                file_size: row.get("file_size"),
                file_hash: row.get("file_hash"),
                commit_hash: row.get("commit_hash"),
                commit_message: row.get("commit_message"),
                created_by: row.get("created_by"),
                parent_version_id: row.get("parent_version_id"),
                status: row.get("status"),
                processing_metadata: row.get("processing_metadata"),
                created_at: row.get("created_at"),
            })
            .collect()
    }
}