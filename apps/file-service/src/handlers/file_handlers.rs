use axum::{
    extract::{Path, Query, State},
    http::StatusCode,
    response::Json,
};
use chrono::Utc;
use serde_json;
use tracing::{error, info, warn};
use uuid::Uuid;

use shared_rust::types::{ProcessingJobType};

use crate::models::{
    CompleteUploadRequest, CompleteUploadResponse, FileMetadata, FileVersion, FileStatus, VersionStatus,
    FileResponse, FileVersionResponse, ListFilesQuery, ListFilesResponse, ListVersionsQuery, 
    ListVersionsResponse, PrepareUploadRequest, PrepareUploadResponse, UpdateFileRequest,
    CreateFileVersionRequest, CreateFileVersionResponse, FileStatsResponse,
};
use crate::state::AppState;

pub async fn prepare_upload(
    State(state): State<AppState>,
    Json(request): Json<PrepareUploadRequest>,
) -> Result<Json<PrepareUploadResponse>, StatusCode> {
    info!("Preparing upload for file: {}", request.filename);

    // Validate file size
    if request.file_size > state.config.max_file_size {
        warn!("File size {} exceeds maximum allowed size {}", request.file_size, state.config.max_file_size);
        return Err(StatusCode::PAYLOAD_TOO_LARGE);
    }

    // Validate content type
    if !state.config.allowed_file_types.contains(&request.content_type) {
        warn!("Content type {} not allowed", request.content_type);
        return Err(StatusCode::UNSUPPORTED_MEDIA_TYPE);
    }

    let file_id = Uuid::new_v4();
    let version_id = Uuid::new_v4();
    let user_id = Uuid::new_v4(); // TODO: Get from authentication
    let now = Utc::now();

    // Create initial file metadata
    let file_metadata = FileMetadata {
        id: file_id,
        user_id,
        filename: request.filename.clone(),
        original_filename: request.filename.clone(),
        content_type: request.content_type.clone(),
        tags: request.tags,
        status: FileStatus::Active,
        current_version_id: None,
        total_versions: 0,
        total_size: 0,
        created_at: now,
        updated_at: now,
    };

    // Store metadata in database first
    if let Err(err) = state.database_service.create_file_metadata(&file_metadata).await {
        error!("Failed to store file metadata: {}", err);
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    // Get next version number
    let version_number = match state.database_service.get_next_version_number(file_id).await {
        Ok(num) => num,
        Err(err) => {
            error!("Failed to get next version number: {}", err);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    // Generate presigned URL
    let (presigned_url, s3_key, expires_at) = match state
        .s3_service
        .generate_presigned_upload_url(
            file_id,
            version_id,
            &request.filename,
            &request.content_type,
            request.file_size,
        )
        .await
    {
        Ok(result) => result,
        Err(err) => {
            error!("Failed to generate presigned URL: {}", err);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    // Create initial file version
    let file_version = FileVersion {
        id: version_id,
        file_id,
        version_number,
        s3_key: s3_key.clone(),
        s3_bucket: state.config.s3_file_bucket.clone(),
        file_size: request.file_size as i64,
        file_hash: String::new(), // Will be set after upload
        commit_hash: None,
        commit_message: request.commit_message,
        created_by: user_id,
        parent_version_id: request.parent_version_id,
        status: VersionStatus::Uploading,
        processing_metadata: None,
        created_at: now,
    };

    // Store version in database
    if let Err(err) = state.database_service.create_file_version(&file_version).await {
        error!("Failed to store file version: {}", err);
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    // Cache metadata
    if let Err(err) = state.cache_service.set_file_metadata(file_id, &file_metadata).await {
        warn!("Failed to cache file metadata: {}", err);
    }

    let response = PrepareUploadResponse {
        file_id,
        version_id,
        presigned_url,
        s3_key,
        expires_at,
    };

    info!("Successfully prepared upload for file: {} version: {}", file_id, version_id);
    Ok(Json(response))
}

pub async fn complete_upload(
    State(state): State<AppState>,
    Json(request): Json<CompleteUploadRequest>,
) -> Result<Json<CompleteUploadResponse>, StatusCode> {
    info!("Completing upload for file: {} version: {}", request.file_id, request.version_id);

    // Get file metadata
    let file_metadata = match state.database_service.get_file_metadata(request.file_id).await {
        Ok(Some(metadata)) => metadata,
        Ok(None) => return Err(StatusCode::NOT_FOUND),
        Err(err) => {
            error!("Failed to get file metadata: {}", err);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    // Get file version
    let mut file_version = match state.database_service.get_file_version(request.version_id).await {
        Ok(Some(version)) => version,
        Ok(None) => return Err(StatusCode::NOT_FOUND),
        Err(err) => {
            error!("Failed to get file version: {}", err);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    // Verify file exists in S3
    let file_exists = match state.s3_service.verify_file_exists(&file_version.s3_key).await {
        Ok(exists) => exists,
        Err(err) => {
            error!("Failed to verify file exists: {}", err);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    if !file_exists {
        warn!("File not found in S3: {}", file_version.s3_key);
        return Err(StatusCode::NOT_FOUND);
    }

    // Get file metadata from S3
    let s3_metadata = match state.s3_service.get_file_metadata(&file_version.s3_key).await {
        Ok(Some(metadata)) => metadata,
        Ok(None) => return Err(StatusCode::NOT_FOUND),
        Err(err) => {
            error!("Failed to get S3 file metadata: {}", err);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    // Update file hash and size
    file_version.file_hash = s3_metadata.etag.unwrap_or_else(|| request.etag.clone());
    if let Some(actual_size) = request.actual_file_size {
        file_version.file_size = actual_size as i64;
    }

    // Update version status to processing
    if let Err(err) = state.database_service.update_version_status(request.version_id, VersionStatus::Processing).await {
        error!("Failed to update version status: {}", err);
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    // Create git commit
    let repository_id = format!("user-{}", file_metadata.user_id);
    let file_path = format!("files/{}", file_metadata.filename);
    let default_message = format!("Add file: {}", file_metadata.filename);
    let commit_message = file_version.commit_message.as_deref().unwrap_or(&default_message);

    // Check git service health first
    let git_service_available = match state.git_service.health_check().await {
        Ok(healthy) => {
            if healthy {
                info!("Git service is healthy, proceeding with commit creation");
                true
            } else {
                warn!("Git service health check failed");
                false
            }
        }
        Err(err) => {
            warn!("Git service health check error: {}", err);
            false
        }
    };

    // Try to create git commit with retries
    let git_commit_hash = if git_service_available {
        let mut attempts = 0;
        let max_attempts = 3;
        let mut last_error = None;
        
        loop {
            attempts += 1;
            
            match state
                .git_service
                .create_commit(
                    &repository_id,
                    &file_path,
                    &file_version.s3_key,
                    commit_message,
                    "File Service",
                    "file-service@filehunt.app",
                )
                .await
            {
                Ok(commit) => {
                    info!("Created git commit: {} (attempt {})", commit.commit_hash, attempts);
                    
                    // Update version with commit hash
                    if let Err(err) = state
                        .database_service
                        .update_version_commit_hash(request.version_id, &commit.commit_hash)
                        .await
                    {
                        error!("Failed to update git commit hash: {}", err);
                    }
                    
                    break Some(commit.commit_hash);
                }
                Err(err) => {
                    warn!("Failed to create git commit (attempt {}): {}", attempts, err);
                    last_error = Some(err);
                    
                    if attempts >= max_attempts {
                        error!("Git commit failed after {} attempts. Last error: {:?}", max_attempts, last_error);
                        
                        // If git service is completely unavailable, we should still allow the upload
                        // but mark it clearly that git commit failed
                        warn!("Proceeding with upload completion despite git commit failure");
                        break None;
                    }
                    
                    // Wait before retry
                    tokio::time::sleep(tokio::time::Duration::from_millis(500 * attempts as u64)).await;
                }
            }
        }
    } else {
        warn!("Git service is not available, skipping commit creation");
        None
    };

    // Update version status to ready
    if let Err(err) = state.database_service.update_version_status(request.version_id, VersionStatus::Ready).await {
        error!("Failed to update version status to ready: {}", err);
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    // Publish file uploaded event
    if let Err(err) = state
        .messaging_service
        .publish_file_uploaded_event(&file_metadata, &file_version)
        .await
    {
        error!("Failed to publish file uploaded event: {}", err);
    }

    // Publish processing job for supported file types
    let processing_params = serde_json::json!({
        "generate_thumbnail": true,
        "extract_metadata": true,
        "virus_scan": true
    });

    let job_type = match file_metadata.content_type.as_str() {
        ct if ct.starts_with("image/") => Some(ProcessingJobType::ThumbnailGeneration),
        ct if ct.starts_with("video/") => Some(ProcessingJobType::VideoTranscode),
        "application/pdf" => Some(ProcessingJobType::DocumentPreview),
        _ => None,
    };

    if let Some(job_type) = job_type {
        if let Err(err) = state
            .messaging_service
            .publish_processing_job(&file_metadata, &file_version, job_type, processing_params)
            .await
        {
            error!("Failed to publish processing job: {}", err);
        }
    }

    // Send upload complete notification
    if let Err(err) = state
        .messaging_service
        .publish_upload_complete_notification(&file_metadata, &file_version)
        .await
    {
        error!("Failed to send upload complete notification: {}", err);
    }

    // Update cache
    file_version.status = VersionStatus::Ready;
    file_version.commit_hash = git_commit_hash.clone();
    if let Err(err) = state.cache_service.set_file_metadata(request.file_id, &file_metadata).await {
        warn!("Failed to update cache: {}", err);
    }

    // Invalidate user cache
    if let Err(err) = state.cache_service.invalidate_user_cache(file_metadata.user_id).await {
        warn!("Failed to invalidate user cache: {}", err);
    }

    let file_url = format!("/api/files/{}", request.file_id);
    let download_url = state.s3_service.generate_presigned_download_url(&file_version.s3_key).await.ok();
    
    let response = CompleteUploadResponse {
        file_id: request.file_id,
        version_id: request.version_id,
        version_number: file_version.version_number,
        status: VersionStatus::Ready,
        commit_hash: git_commit_hash,
        file_url,
        download_url,
    };

    info!("Successfully completed upload for file: {} version: {}", request.file_id, request.version_id);
    Ok(Json(response))
}

pub async fn get_file(
    State(state): State<AppState>,
    Path(file_id): Path<Uuid>,
) -> Result<Json<FileResponse>, StatusCode> {
    info!("Getting file: {}", file_id);

    // Try to get from cache first
    let file_metadata = match state.cache_service.get_file_metadata(file_id).await {
        Ok(Some(metadata)) => metadata,
        _ => {
            // Get from database
            match state.database_service.get_file_metadata(file_id).await {
                Ok(Some(metadata)) => metadata,
                Ok(None) => return Err(StatusCode::NOT_FOUND),
                Err(err) => {
                    error!("Failed to get file metadata: {}", err);
                    return Err(StatusCode::INTERNAL_SERVER_ERROR);
                }
            }
        }
    };

    // Get current version if available
    let current_version = if let Some(version_id) = file_metadata.current_version_id {
        match state.database_service.get_file_version(version_id).await {
            Ok(Some(version)) => Some(FileVersionResponse {
                id: version.id,
                version_number: version.version_number,
                file_size: version.file_size,
                file_hash: version.file_hash,
                commit_hash: version.commit_hash,
                commit_message: version.commit_message,
                created_by: version.created_by,
                status: version.status,
                created_at: version.created_at,
            }),
            _ => None,
        }
    } else {
        None
    };

    // Generate download URL if current version is ready
    let download_url = if let Some(ref version) = current_version {
        if version.status == VersionStatus::Ready {
            if let Ok(Some(current_version_full)) = state.database_service.get_file_version(version.id).await {
                state.s3_service.generate_presigned_download_url(&current_version_full.s3_key).await.ok()
            } else {
                None
            }
        } else {
            None
        }
    } else {
        None
    };

    let response = FileResponse {
        file_metadata,
        current_version,
        download_url,
    };

    Ok(Json(response))
}

pub async fn list_files(
    State(state): State<AppState>,
    Query(query): Query<ListFilesQuery>,
) -> Result<Json<ListFilesResponse>, StatusCode> {
    info!("Listing files with query: {:?}", query);

    // Try cache for user files
    if let Some(user_id) = query.user_id {
        if query.status.is_none() && query.content_type.is_none() && query.search.is_none() && query.page.unwrap_or(1) == 1 {
            if let Ok(Some(cached_files)) = state.cache_service.get_user_files_cache(user_id).await {
                let limit = query.limit.unwrap_or(20) as usize;
                let files: Vec<FileMetadata> = cached_files.into_iter().take(limit).collect();
                let total = files.len() as i64;
                
                // Convert to FileResponse format
                let file_responses: Vec<FileResponse> = files.into_iter().map(|metadata| {
                    FileResponse {
                        file_metadata: metadata,
                        current_version: None, // Skip version details for list view
                        download_url: None,
                    }
                }).collect();
                
                let response = ListFilesResponse {
                    files: file_responses,
                    total,
                    page: 1,
                    limit: limit as u32,
                };
                return Ok(Json(response));
            }
        }
    }

    // Get from database
    let (files, total) = match state.database_service.list_files(&query).await {
        Ok(result) => result,
        Err(err) => {
            error!("Failed to list files: {}", err);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    // Convert to FileResponse format
    let mut file_responses = Vec::new();
    for metadata in files {
        let current_version = if let Some(version_id) = metadata.current_version_id {
            match state.database_service.get_file_version(version_id).await {
                Ok(Some(version)) => Some(FileVersionResponse {
                    id: version.id,
                    version_number: version.version_number,
                    file_size: version.file_size,
                    file_hash: version.file_hash,
                    commit_hash: version.commit_hash,
                    commit_message: version.commit_message,
                    created_by: version.created_by,
                    status: version.status,
                    created_at: version.created_at,
                }),
                _ => None,
            }
        } else {
            None
        };

        file_responses.push(FileResponse {
            file_metadata: metadata,
            current_version,
            download_url: None, // Skip download URLs for list view for performance
        });
    }

    // Cache user files if applicable
    if let Some(user_id) = query.user_id {
        if query.status.is_none() && query.content_type.is_none() && query.search.is_none() && query.page.unwrap_or(1) == 1 {
            let files_for_cache: Vec<FileMetadata> = file_responses.iter().map(|fr| fr.file_metadata.clone()).collect();
            if let Err(err) = state.cache_service.set_user_files_cache(user_id, &files_for_cache).await {
                warn!("Failed to cache user files: {}", err);
            }
        }
    }

    let response = ListFilesResponse {
        files: file_responses,
        total,
        page: query.page.unwrap_or(1),
        limit: query.limit.unwrap_or(20),
    };

    Ok(Json(response))
}

pub async fn list_file_versions(
    State(state): State<AppState>,
    Query(query): Query<ListVersionsQuery>,
) -> Result<Json<ListVersionsResponse>, StatusCode> {
    info!("Listing versions for file: {}", query.file_id);

    // Get versions from database
    let (versions, total) = match state.database_service.list_file_versions(&query).await {
        Ok(result) => result,
        Err(err) => {
            error!("Failed to list file versions: {}", err);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    let version_responses: Vec<FileVersionResponse> = versions.into_iter().map(|version| {
        FileVersionResponse {
            id: version.id,
            version_number: version.version_number,
            file_size: version.file_size,
            file_hash: version.file_hash,
            commit_hash: version.commit_hash,
            commit_message: version.commit_message,
            created_by: version.created_by,
            status: version.status,
            created_at: version.created_at,
        }
    }).collect();

    let response = ListVersionsResponse {
        file_id: query.file_id,
        versions: version_responses,
        total,
        page: query.page.unwrap_or(1),
        limit: query.limit.unwrap_or(20),
    };

    Ok(Json(response))
}

pub async fn update_file(
    State(state): State<AppState>,
    Path(file_id): Path<Uuid>,
    Json(request): Json<UpdateFileRequest>,
) -> Result<Json<FileResponse>, StatusCode> {
    info!("Updating file: {}", file_id);

    // Update file metadata
    if let Err(err) = state.database_service.update_file_metadata(file_id, request.filename, request.tags).await {
        error!("Failed to update file metadata: {}", err);
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    // Invalidate cache
    if let Err(err) = state.cache_service.delete_file_metadata(file_id).await {
        warn!("Failed to invalidate file cache: {}", err);
    }

    // Return updated file
    get_file(State(state), Path(file_id)).await
}

pub async fn delete_file(
    State(state): State<AppState>,
    Path(file_id): Path<Uuid>,
) -> Result<StatusCode, StatusCode> {
    info!("Deleting file: {}", file_id);

    // Get file metadata
    let file_metadata = match state.database_service.get_file_metadata(file_id).await {
        Ok(Some(metadata)) => metadata,
        Ok(None) => return Err(StatusCode::NOT_FOUND),
        Err(err) => {
            error!("Failed to get file metadata: {}", err);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    // Mark as deleted in database
    if let Err(err) = state.database_service.delete_file_metadata(file_id).await {
        error!("Failed to delete file metadata: {}", err);
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    // Publish file deleted event
    if let Err(err) = state.messaging_service.publish_file_deleted_event(&file_metadata).await {
        error!("Failed to publish file deleted event: {}", err);
    }

    // Remove from cache
    if let Err(err) = state.cache_service.delete_file_metadata(file_id).await {
        warn!("Failed to remove file from cache: {}", err);
    }

    // Invalidate user cache
    if let Err(err) = state.cache_service.invalidate_user_cache(file_metadata.user_id).await {
        warn!("Failed to invalidate user cache: {}", err);
    }

    info!("Successfully deleted file: {}", file_id);
    Ok(StatusCode::NO_CONTENT)
}

pub async fn create_file_version(
    State(state): State<AppState>,
    Json(request): Json<CreateFileVersionRequest>,
) -> Result<Json<CreateFileVersionResponse>, StatusCode> {
    info!("Creating new version for file: {}", request.file_id);

    // Get file metadata
    let file_metadata = match state.database_service.get_file_metadata(request.file_id).await {
        Ok(Some(metadata)) => metadata,
        Ok(None) => return Err(StatusCode::NOT_FOUND),
        Err(err) => {
            error!("Failed to get file metadata: {}", err);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    let version_id = Uuid::new_v4();
    let user_id = Uuid::new_v4(); // TODO: Get from authentication

    // Get next version number
    let version_number = match state.database_service.get_next_version_number(request.file_id).await {
        Ok(num) => num,
        Err(err) => {
            error!("Failed to get next version number: {}", err);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    // Generate presigned URL
    let (presigned_url, s3_key, expires_at) = match state
        .s3_service
        .generate_presigned_upload_url(
            request.file_id,
            version_id,
            &file_metadata.filename,
            &file_metadata.content_type,
            request.file_size,
        )
        .await
    {
        Ok(result) => result,
        Err(err) => {
            error!("Failed to generate presigned URL: {}", err);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    // Create file version
    let file_version = FileVersion {
        id: version_id,
        file_id: request.file_id,
        version_number,
        s3_key: s3_key.clone(),
        s3_bucket: state.config.s3_file_bucket.clone(),
        file_size: request.file_size as i64,
        file_hash: String::new(), // Will be set after upload
        commit_hash: None,
        commit_message: request.commit_message,
        created_by: user_id,
        parent_version_id: request.parent_version_id,
        status: VersionStatus::Uploading,
        processing_metadata: None,
        created_at: Utc::now(),
    };

    // Store version in database
    if let Err(err) = state.database_service.create_file_version(&file_version).await {
        error!("Failed to store file version: {}", err);
        return Err(StatusCode::INTERNAL_SERVER_ERROR);
    }

    let response = CreateFileVersionResponse {
        version_id,
        presigned_url,
        s3_key,
        expires_at,
    };

    info!("Successfully created version {} for file: {}", version_id, request.file_id);
    Ok(Json(response))
}

pub async fn get_file_stats(
    State(state): State<AppState>,
    Query(query): Query<ListFilesQuery>,
) -> Result<Json<FileStatsResponse>, StatusCode> {
    info!("Getting file stats");

    // Try cache first
    if let Ok(Some(cached_stats)) = state.cache_service.get_file_stats(query.user_id).await {
        if let Ok(stats) = serde_json::from_value::<FileStatsResponse>(cached_stats) {
            return Ok(Json(stats));
        }
    }

    // Get from database
    let stats = match state.database_service.get_file_stats(query.user_id).await {
        Ok(stats) => stats,
        Err(err) => {
            error!("Failed to get file stats: {}", err);
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    };

    // Cache stats
    if let Ok(stats_value) = serde_json::to_value(&stats) {
        if let Err(err) = state.cache_service.set_file_stats(query.user_id, &stats_value).await {
            warn!("Failed to cache file stats: {}", err);
        }
    }

    Ok(Json(stats))
}