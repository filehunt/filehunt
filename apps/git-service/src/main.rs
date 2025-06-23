use axum::{
    http::{header, Method},
    middleware,
    routing::{get, post},
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
                .unwrap_or_else(|_| "git_service=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load configuration
    let config = Config::from_env().expect("Failed to load configuration");
    info!("Starting git-service on port {}", config.server_port);
    info!("S3 Bucket: {}", config.s3_bucket);
    if let Some(endpoint) = &config.s3_endpoint {
        info!("S3 Endpoint: {}", endpoint);
    }

    // Initialize application state
    let app_state = AppState::new(config.clone()).await;

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
        
        // Repository endpoints
        .route("/repositories", post(create_repository))
        .route("/repositories", get(list_repositories))
        .route("/repositories/{repository_id}", get(get_repository))
        
        // Commit endpoints
        .route("/repositories/{repository_id}/commits", post(create_commit))
        .route("/repositories/{repository_id}/commits", get(list_commits))
        .route("/repositories/{repository_id}/commits/{commit_id}", get(get_commit))
        .route("/repositories/{repository_id}/commits/{commit_id}/details", get(get_commit_details))
        .route("/repositories/{repository_id}/commits/{commit_id}/file", get(get_commit_file))
        
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
    
    info!("Git service listening on {}", listener.local_addr().unwrap());
    
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