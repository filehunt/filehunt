use axum::{
    extract::{Path, Query, State},
    response::Json,
    Json as JsonExtractor,
};
use serde::Deserialize;

use crate::{
    models::{CreateCommitRequest, CommitListResponse, CommitDetailsResponse, Result},
    services::GitService,
    state::AppState,
};

#[derive(Deserialize)]
pub struct ListCommitsQuery {
    pub limit: Option<usize>,
    pub offset: Option<usize>,
}

pub async fn create_commit(
    State(state): State<AppState>,
    JsonExtractor(request): JsonExtractor<CreateCommitRequest>,
) -> Result<Json<crate::models::Commit>> {
    let s3_config = shared_rust::s3::S3Config::from_env("git-service");
    let s3_service = shared_rust::s3::S3Service::from_config(&s3_config).await?;
    let git_service = GitService::new(s3_service);
    
    // For now, create a simple commit without real Git operations
    // This avoids the Send/Sync issues with git2
    let commit = git_service.create_simple_commit(request).await?;
    
    Ok(Json(commit))
}

pub async fn get_commit(
    State(state): State<AppState>,
    Path((repository_id, commit_id)): Path<(String, String)>,
) -> Result<Json<crate::models::Commit>> {
    let s3_config = shared_rust::s3::S3Config::from_env("git-service");
    let s3_service = shared_rust::s3::S3Service::from_config(&s3_config).await?;
    let git_service = GitService::new(s3_service);
    let commit = git_service.get_commit(&repository_id, commit_id).await?;
    
    Ok(Json(commit))
}

pub async fn get_commit_details(
    State(state): State<AppState>,
    Path((repository_id, commit_id)): Path<(String, String)>,
) -> Result<Json<CommitDetailsResponse>> {
    let s3_config = shared_rust::s3::S3Config::from_env("git-service");
    let s3_service = shared_rust::s3::S3Service::from_config(&s3_config).await?;
    let git_service = GitService::new(s3_service);
    let details = git_service.get_commit_details(&repository_id, commit_id).await?;
    
    Ok(Json(details))
}

pub async fn list_commits(
    State(state): State<AppState>,
    Path(repository_id): Path<String>,
    Query(query): Query<ListCommitsQuery>,
) -> Result<Json<CommitListResponse>> {
    let s3_config = shared_rust::s3::S3Config::from_env("git-service");
    let s3_service = shared_rust::s3::S3Service::from_config(&s3_config).await?;
    let git_service = GitService::new(s3_service);
    let commits = git_service.list_commits(&repository_id, query.limit, query.offset).await?;
    
    Ok(Json(commits))
}

pub async fn get_commit_file(
    State(state): State<AppState>,
    Path((repository_id, commit_id)): Path<(String, String)>,
) -> Result<Vec<u8>> {
    let s3_config = shared_rust::s3::S3Config::from_env("git-service");
    let s3_service = shared_rust::s3::S3Service::from_config(&s3_config).await?;
    let git_service = GitService::new(s3_service);
    let file_content = git_service.get_commit_file_content(&repository_id, commit_id).await?;
    
    Ok(file_content.to_vec())
}