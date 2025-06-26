use std::env;

#[derive(Debug, Clone)]
pub struct Config {
    pub server_port: u16,
    pub database_url: String,
    pub redis_url: String,
    
    // AWS Configuration
    pub aws_region: String,
    pub aws_access_key_id: String,
    pub aws_secret_access_key: String,
    
    // S3 Configuration
    pub s3_endpoint: Option<String>,
    pub s3_file_bucket: String,
    pub s3_git_bucket: String,
    pub s3_shared_bucket: String,
    pub s3_processing_bucket: String,
    pub s3_presigned_url_expiry: u64,
    pub s3_kms_key_id: Option<String>,
    
    // SNS Configuration
    pub sns_endpoint: Option<String>,
    pub sns_topic_arn: String,
    
    // SQS Configuration (for workers)
    pub sqs_endpoint: Option<String>,
    
    // External Services
    pub git_service_url: String,
    
    // Application Settings
    pub max_file_size: u64,
    pub allowed_file_types: Vec<String>,
}

impl Config {
    pub fn from_env() -> Result<Self, env::VarError> {
        Ok(Config {
            server_port: env::var("SERVER_PORT")
                .unwrap_or_else(|_| "3001".to_string())
                .parse()
                .unwrap_or(3001),
            
            database_url: env::var("DATABASE_URL")?,
            redis_url: env::var("REDIS_URL")
                .unwrap_or_else(|_| "redis://localhost:6379".to_string()),
            
            aws_region: env::var("AWS_REGION")
                .unwrap_or_else(|_| "us-east-1".to_string()),
            aws_access_key_id: env::var("AWS_ACCESS_KEY_ID")?,
            aws_secret_access_key: env::var("AWS_SECRET_ACCESS_KEY")?,
            
            s3_endpoint: env::var("S3_ENDPOINT").ok(),
            s3_file_bucket: env::var("S3_FILE_BUCKET")
                .unwrap_or_else(|_| "filehunt-files".to_string()),
            s3_git_bucket: env::var("S3_GIT_BUCKET")
                .unwrap_or_else(|_| "filehunt-git".to_string()),
            s3_shared_bucket: env::var("S3_SHARED_BUCKET")
                .unwrap_or_else(|_| "filehunt-shared".to_string()),
            s3_processing_bucket: env::var("S3_PROCESSING_BUCKET")
                .unwrap_or_else(|_| "filehunt-processing".to_string()),
            s3_presigned_url_expiry: env::var("S3_PRESIGNED_URL_EXPIRY")
                .unwrap_or_else(|_| "3600".to_string())
                .parse()
                .unwrap_or(3600),
            s3_kms_key_id: env::var("S3_KMS_KEY_ID").ok(),
            
            sns_endpoint: env::var("SNS_ENDPOINT").ok(),
            sns_topic_arn: env::var("SNS_TOPIC_ARN")
                .unwrap_or_else(|_| "arn:aws:sns:us-east-1:000000000000:filehunt-file-events".to_string()),
            
            sqs_endpoint: env::var("SQS_ENDPOINT").ok(),
            
            git_service_url: env::var("GIT_SERVICE_URL")
                .unwrap_or_else(|_| "http://localhost:3000".to_string()),
            
            max_file_size: env::var("MAX_FILE_SIZE")
                .unwrap_or_else(|_| "104857600".to_string()) // 100MB default
                .parse()
                .unwrap_or(104857600),
            allowed_file_types: env::var("ALLOWED_FILE_TYPES")
                .unwrap_or_else(|_| "image/jpeg,image/png,image/gif,text/plain,application/pdf,video/mp4,audio/mpeg,application/json,text/markdown".to_string())
                .split(',')
                .map(|s| s.trim().to_string())
                .collect(),
        })
    }
}