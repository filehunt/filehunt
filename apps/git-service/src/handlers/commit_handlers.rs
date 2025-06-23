use axum::{
    extract::{Path, Query, State},
    response::Json,
    Json as JsonExtractor,
};
use serde::Deserialize;
use uuid::Uuid;
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
    let s3_service = crate::services::S3Service::new(state.s3_client, state.config.s3_bucket.clone());
    let git_service = GitService::new(s3_service);
    let commit = git_service.create_commit(request).await?;
    
    Ok(Json(commit))
}

pub async fn get_commit(
    State(state): State<AppState>,
    Path((repository_id, commit_id)): Path<(String, Uuid)>,
) -> Result<Json<crate::models::Commit>> {
    let s3_service = crate::services::S3Service::new(state.s3_client, state.config.s3_bucket.clone());
    let git_service = GitService::new(s3_service);
    let commit = git_service.get_commit(&repository_id, commit_id).await?;
    
    Ok(Json(commit))
}

pub async fn get_commit_details(
    State(state): State<AppState>,
    Path((repository_id, commit_id)): Path<(String, Uuid)>,
) -> Result<Json<CommitDetailsResponse>> {
    let s3_service = crate::services::S3Service::new(state.s3_client, state.config.s3_bucket.clone());
    let git_service = GitService::new(s3_service);
    let details = git_service.get_commit_details(&repository_id, commit_id).await?;
    
    Ok(Json(details))
}

pub async fn list_commits(
    State(state): State<AppState>,
    Path(repository_id): Path<String>,
    Query(query): Query<ListCommitsQuery>,
) -> Result<Json<CommitListResponse>> {
    let s3_service = crate::services::S3Service::new(state.s3_client, state.config.s3_bucket.clone());
    let git_service = GitService::new(s3_service);
    let commits = git_service.list_commits(&repository_id, query.limit, query.offset).await?;
    
    Ok(Json(commits))
}

pub async fn get_commit_file(
    State(state): State<AppState>,
    Path((repository_id, commit_id)): Path<(String, Uuid)>,
) -> Result<Vec<u8>> {
    let s3_service = crate::services::S3Service::new(state.s3_client, state.config.s3_bucket.clone());
    let git_service = GitService::new(s3_service);
    let file_content = git_service.get_commit_file_content(&repository_id, commit_id).await?;
    
    Ok(file_content.to_vec())
}