use axum::{
    http::{header, Method},
    middleware,
    routing::{delete, get, post, put},
    Router,
};
use dotenv::dotenv;
use tower::ServiceBuilder;
use tower_http::cors::{Any, CorsLayer};
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod handlers;
mod models;
mod services;
mod state;

use config::Config;
use handlers::*;
use state::AppState;

#[tokio::main]
async fn main() {
    // Load environment variables
    dotenv().ok();
    
    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "file_service=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load configuration
    let config = Config::from_env().expect("Failed to load configuration");
    info!("Starting file-service on port {}", config.server_port);
    info!("S3 File Bucket: {}", config.s3_file_bucket);
    if let Some(endpoint) = &config.s3_endpoint {
        info!("S3 Endpoint: {}", endpoint);
    }
    info!("Git Service URL: {}", config.git_service_url);

    // Initialize application state
    let app_state = AppState::new(config.clone())
        .await
        .expect("Failed to initialize application state");

    // CORS configuration
    let cors = CorsLayer::new()
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE, Method::OPTIONS])
        .allow_headers([header::CONTENT_TYPE, header::AUTHORIZATION])
        .allow_origin(Any);

    // Build router
    let app = Router::new()
        // Health endpoints
        .route("/health", get(health_check))
        .route("/ready", get(readiness_check))
        .route("/live", get(liveness_check))
        
        // File upload endpoints
        .route("/files/prepare", post(prepare_upload))
        .route("/files/complete", post(complete_upload))
        
        // File management endpoints
        .route("/files/{file_id}", get(get_file))
        .route("/files/{file_id}", delete(delete_file))
        .route("/files/{file_id}", put(update_file))
        .route("/files", get(list_files))
        
        // File version endpoints
        .route("/files/{file_id}/versions", get(list_file_versions))
        .route("/files/versions", post(create_file_version))
        
        // Statistics endpoints
        .route("/stats", get(get_file_stats))
        
        // Add middleware
        .layer(
            ServiceBuilder::new()
                .layer(cors)
                .layer(middleware::from_fn(logging_middleware))
        )
        .with_state(app_state);

    // Start server
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", config.server_port))
        .await
        .expect("Failed to bind to port");
    
    info!("File service listening on {}", listener.local_addr().unwrap());
    
    axum::serve(listener, app)
        .await
        .expect("Failed to start server");
}

async fn logging_middleware(
    request: axum::extract::Request,
    next: axum::middleware::Next,
) -> axum::response::Response {
    let method = request.method().clone();
    let uri = request.uri().clone();
    
    let start_time = std::time::Instant::now();
    let response = next.run(request).await;
    let duration = start_time.elapsed();
    
    info!(
        "{} {} - {} - {:?}",
        method,
        uri,
        response.status(),
        duration
    );
    
    response
}