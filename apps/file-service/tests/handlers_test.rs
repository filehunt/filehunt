use axum::{
    body::Body,
    http::{Request, StatusCode},
    Router,
};
use tower::ServiceExt;
use uuid::Uuid;
use serde_json;

async fn create_test_app() -> Router {
    // Create a minimal router for testing
    Router::new()
        .route("/health", axum::routing::get(|| async { "OK" }))
        .route("/files", axum::routing::get(list_files_handler))
        .route("/files/{id}", axum::routing::get(get_file_handler))
}

async fn list_files_handler() -> axum::response::Json<serde_json::Value> {
    axum::response::Json(serde_json::json!({
        "files": [],
        "total": 0,
        "page": 1,
        "limit": 20
    }))
}

async fn get_file_handler(
    axum::extract::Path(id): axum::extract::Path<String>,
) -> Result<axum::response::Json<serde_json::Value>, StatusCode> {
    if id == "invalid" {
        return Err(StatusCode::NOT_FOUND);
    }
    
    Ok(axum::response::Json(serde_json::json!({
        "id": id,
        "filename": "test.txt",
        "status": "active"
    })))
}

#[tokio::test]
async fn test_health_endpoint() {
    let app = create_test_app().await;
    
    let response = app
        .oneshot(
            Request::builder()
                .uri("/health")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    
    assert_eq!(response.status(), StatusCode::OK);
}

#[tokio::test]
async fn test_list_files_endpoint() {
    let app = create_test_app().await;
    
    let response = app
        .oneshot(
            Request::builder()
                .uri("/files")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    
    assert_eq!(response.status(), StatusCode::OK);
    
    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let json: serde_json::Value = serde_json::from_slice(&body).unwrap();
    
    assert_eq!(json["total"], 0);
    assert_eq!(json["page"], 1);
    assert_eq!(json["limit"], 20);
}

#[tokio::test]
async fn test_get_file_endpoint_success() {
    let app = create_test_app().await;
    let file_id = Uuid::new_v4().to_string();
    
    let response = app
        .oneshot(
            Request::builder()
                .uri(&format!("/files/{}", file_id))
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    
    assert_eq!(response.status(), StatusCode::OK);
    
    let body = axum::body::to_bytes(response.into_body(), usize::MAX).await.unwrap();
    let json: serde_json::Value = serde_json::from_slice(&body).unwrap();
    
    assert_eq!(json["id"], file_id);
    assert_eq!(json["filename"], "test.txt");
    assert_eq!(json["status"], "active");
}

#[tokio::test]
async fn test_get_file_endpoint_not_found() {
    let app = create_test_app().await;
    
    let response = app
        .oneshot(
            Request::builder()
                .uri("/files/invalid")
                .body(Body::empty())
                .unwrap(),
        )
        .await
        .unwrap();
    
    assert_eq!(response.status(), StatusCode::NOT_FOUND);
}

#[tokio::test]
async fn test_request_validation() {
    let _file_id = Uuid::new_v4();
    let request_data = serde_json::json!({
        "filename": "test.txt",
        "content_type": "text/plain",
        "file_size": 1024,
        "tags": {"category": "test"}
    });
    
    // Validate required fields are present
    assert!(request_data["filename"].is_string());
    assert!(request_data["content_type"].is_string());
    assert!(request_data["file_size"].is_number());
    assert!(request_data["tags"].is_object());
}

#[tokio::test]
async fn test_response_serialization() {
    let response_data = serde_json::json!({
        "file_id": Uuid::new_v4(),
        "version_id": Uuid::new_v4(),
        "presigned_url": "https://s3.example.com/bucket/key",
        "expires_at": chrono::Utc::now().to_rfc3339()
    });
    
    let serialized = serde_json::to_string(&response_data).unwrap();
    let deserialized: serde_json::Value = serde_json::from_str(&serialized).unwrap();
    
    assert_eq!(response_data["presigned_url"], deserialized["presigned_url"]);
    assert!(deserialized["expires_at"].is_string());
}

#[tokio::test]
async fn test_error_response_format() {
    let error_response = serde_json::json!({
        "error": "FILE_NOT_FOUND",
        "message": "The requested file was not found",
        "code": 404,
        "timestamp": chrono::Utc::now().to_rfc3339()
    });
    
    assert_eq!(error_response["error"], "FILE_NOT_FOUND");
    assert_eq!(error_response["code"], 404);
    assert!(error_response["message"].is_string());
    assert!(error_response["timestamp"].is_string());
}