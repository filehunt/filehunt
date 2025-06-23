use aws_sdk_s3::Client as S3Client;
use crate::config::Config;

#[derive(Clone)]
pub struct AppState {
    pub s3_client: S3Client,
    pub config: Config,
}

impl AppState {
    pub async fn new(config: Config) -> Self {
        let mut aws_config_builder = aws_config::defaults(aws_config::BehaviorVersion::latest())
            .region(aws_config::Region::new(config.s3_region.clone()));

        if let Some(endpoint) = &config.s3_endpoint {
            aws_config_builder = aws_config_builder.endpoint_url(endpoint);
        }

        if let (Some(access_key), Some(secret_key)) = (&config.aws_access_key_id, &config.aws_secret_access_key) {
            let credentials = aws_credential_types::Credentials::new(
                access_key,
                secret_key,
                None,
                None,
                "git-service"
            );
            aws_config_builder = aws_config_builder.credentials_provider(credentials);
        }

        let aws_config = aws_config_builder.load().await;

        let mut s3_config_builder = aws_sdk_s3::config::Builder::from(&aws_config);
        
        if config.s3_endpoint.is_some() {
            // Force path-style addressing for LocalStack
            s3_config_builder = s3_config_builder.force_path_style(true);
        }
        
        let s3_config = s3_config_builder.build();
        let s3_client = S3Client::from_conf(s3_config);

        Self {
            s3_client,
            config,
        }
    }
}