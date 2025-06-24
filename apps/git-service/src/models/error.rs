use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde::{Deserialize, Serialize};
use thiserror::Error;

#[derive(Error, Debug)]
pub enum GitServiceError {
    #[error("Repository not found: {0}")]
    RepositoryNotFound(String),
    
    #[error("Commit not found: {0}")]
    CommitNotFound(String),
    
    #[error("File not found: {0}")]
    FileNotFound(String),
    
    #[error("Invalid repository name: {0}")]
    InvalidRepositoryName(String),
    
    #[error("Invalid commit message: {0}")]
    InvalidCommitMessage(String),
    
    #[error("S3 operation failed: {0}")]
    S3Error(String),
    
    #[error("Serialization error: {0}")]
    SerializationError(String),
    
    #[error("File hash mismatch")]
    FileHashMismatch,
    
    #[error("Repository already exists: {0}")]
    RepositoryAlreadyExists(String),
    
    #[error("Internal server error: {0}")]
    InternalError(String),
    
    #[error("Bad request: {0}")]
    BadRequest(String),
}

#[derive(Serialize, Deserialize)]
pub struct ErrorResponse {
    pub error: String,
    pub message: String,
    pub status_code: u16,
}

impl IntoResponse for GitServiceError {
    fn into_response(self) -> Response {
        let (status, error_type, message) = match &self {
            GitServiceError::RepositoryNotFound(_) => {
                (StatusCode::NOT_FOUND, "REPOSITORY_NOT_FOUND", self.to_string())
            }
            GitServiceError::CommitNotFound(_) => {
                (StatusCode::NOT_FOUND, "COMMIT_NOT_FOUND", self.to_string())
            }
            GitServiceError::FileNotFound(_) => {
                (StatusCode::NOT_FOUND, "FILE_NOT_FOUND", self.to_string())
            }
            GitServiceError::InvalidRepositoryName(_) | 
            GitServiceError::InvalidCommitMessage(_) | 
            GitServiceError::BadRequest(_) => {
                (StatusCode::BAD_REQUEST, "BAD_REQUEST", self.to_string())
            }
            GitServiceError::RepositoryAlreadyExists(_) => {
                (StatusCode::CONFLICT, "REPOSITORY_ALREADY_EXISTS", self.to_string())
            }
            GitServiceError::FileHashMismatch => {
                (StatusCode::BAD_REQUEST, "FILE_HASH_MISMATCH", self.to_string())
            }
            GitServiceError::S3Error(_) | 
            GitServiceError::SerializationError(_) | 
            GitServiceError::InternalError(_) => {
                (StatusCode::INTERNAL_SERVER_ERROR, "INTERNAL_ERROR", self.to_string())
            }
        };

        let error_response = ErrorResponse {
            error: error_type.to_string(),
            message,
            status_code: status.as_u16(),
        };

        (status, Json(error_response)).into_response()
    }
}

impl From<serde_json::Error> for GitServiceError {
    fn from(err: serde_json::Error) -> Self {
        GitServiceError::SerializationError(err.to_string())
    }
}



impl From<anyhow::Error> for GitServiceError {
    fn from(err: anyhow::Error) -> Self {
        GitServiceError::InternalError(err.to_string())
    }
}

impl From<shared_rust::s3::S3Error> for GitServiceError {
    fn from(err: shared_rust::s3::S3Error) -> Self {
        GitServiceError::S3Error(err.to_string())
    }
}

pub type Result<T> = std::result::Result<T, GitServiceError>;