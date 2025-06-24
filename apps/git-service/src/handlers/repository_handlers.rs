use axum::{
    extract::{Path, State},
    response::Json,
    Json as JsonExtractor,
};
use crate::{
    models::{CreateRepositoryRequest, RepositoryResponse, Result},
    services::GitService,
    state::AppState,
};

pub async fn create_repository(
    State(state): State<AppState>,
    JsonExtractor(request): JsonExtractor<CreateRepositoryRequest>,
) -> Result<Json<RepositoryResponse>> {
    let s3_config = shared_rust::s3::S3Config::from_env("git-service");
    let s3_service = shared_rust::s3::S3Service::from_config(&s3_config).await?;
    let git_service = GitService::new(s3_service);
    let repository = git_service.create_repository(request).await?;
    
    let response = RepositoryResponse {
        repository,
        commit_count: 0,
        branches: vec!["main".to_string()],
        head_commit: None,
        status: crate::models::RepositoryStatus {
            is_initialized: true,
            has_commits: false,
            is_syncing: false,
            sync_status: crate::models::SyncStatus::Pending,
            pending_files: 0,
        },
    };
    
    Ok(Json(response))
}

pub async fn get_repository(
    State(state): State<AppState>,
    Path(repository_id): Path<String>,
) -> Result<Json<RepositoryResponse>> {
    let s3_config = shared_rust::s3::S3Config::from_env("git-service");
    let s3_service = shared_rust::s3::S3Service::from_config(&s3_config).await?;
    let git_service = GitService::new(s3_service);
    let response = git_service.get_repository_with_stats(&repository_id).await?;
    
    Ok(Json(response))
}

pub async fn list_repositories(
    State(state): State<AppState>,
) -> Result<Json<Vec<crate::models::Repository>>> {
    let s3_config = shared_rust::s3::S3Config::from_env("git-service");
    let s3_service = shared_rust::s3::S3Service::from_config(&s3_config).await?;
    let git_service = GitService::new(s3_service);
    let repositories = git_service.list_repositories().await?;
    
    Ok(Json(repositories))
}