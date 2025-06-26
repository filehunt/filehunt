use axum::{
    extract::State,
    http::StatusCode,
    response::Json,
};
use serde_json;
use tracing::info;

use crate::state::AppState;

pub async fn health_check() -> Result<Json<serde_json::Value>, StatusCode> {
    info!("Health check requested");
    
    let response = serde_json::json!({
        "status": "healthy",
        "service": "file-service",
        "timestamp": chrono::Utc::now()
    });
    
    Ok(Json(response))
}

pub async fn readiness_check(
    State(state): State<AppState>,
) -> Result<Json<serde_json::Value>, StatusCode> {
    info!("Readiness check requested");
    
    let health_status = state.health_check().await;
    
    // Check if critical services are ready
    let services = health_status["services"].as_object().unwrap();
    let all_ready = services.values().all(|v| v.as_bool().unwrap_or(false));
    
    if all_ready {
        Ok(Json(serde_json::json!({
            "status": "ready",
            "service": "file-service",
            "services": services,
            "timestamp": chrono::Utc::now()
        })))
    } else {
        Err(StatusCode::SERVICE_UNAVAILABLE)
    }
}

pub async fn liveness_check() -> Result<Json<serde_json::Value>, StatusCode> {
    info!("Liveness check requested");
    
    let response = serde_json::json!({
        "status": "alive",
        "service": "file-service",
        "timestamp": chrono::Utc::now()
    });
    
    Ok(Json(response))
}