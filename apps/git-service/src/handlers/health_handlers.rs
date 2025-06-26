use axum::{
    extract::State,
    http::StatusCode,
    response::Json,
};
use serde::{Deserialize, Serialize};
use crate::{
    models::Result,
    services::GitService,
    state::AppState,
};

#[derive(Serialize, Deserialize)]
pub struct HealthResponse {
    pub status: String,
    pub service: String,
    pub version: String,
    pub timestamp: chrono::DateTime<chrono::Utc>,
    pub s3_connection: bool,
}

pub async fn health_check(
    State(state): State<AppState>,
) -> Result<Json<HealthResponse>> {
    let s3_config = shared_rust::s3::S3Config::from_env();
    let s3_service = shared_rust::s3::S3Service::from_config(&s3_config).await?;
    let git_service = GitService::new(s3_service);
    
    let s3_connection = match git_service.health_check().await {
        Ok(_) => {
            tracing::info!("S3 health check passed");
            true
        },
        Err(e) => {
            tracing::error!("S3 health check failed: {:?}", e);
            false
        },
    };

    let response = HealthResponse {
        status: if s3_connection { "healthy".to_string() } else { "degraded".to_string() },
        service: "git-service".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        timestamp: chrono::Utc::now(),
        s3_connection,
    };

    Ok(Json(response))
}

pub async fn readiness_check(
    State(state): State<AppState>,
) -> std::result::Result<StatusCode, StatusCode> {
    let s3_config = shared_rust::s3::S3Config::from_env();
    let s3_service = shared_rust::s3::S3Service::from_config(&s3_config).await.map_err(|_| StatusCode::SERVICE_UNAVAILABLE)?;
    let git_service = GitService::new(s3_service);
    
    match git_service.health_check().await {
        Ok(_) => Ok(StatusCode::OK),
        Err(_) => Err(StatusCode::SERVICE_UNAVAILABLE),
    }
}