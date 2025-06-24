use crate::config::Config;

#[derive(Clone)]
pub struct AppState {
    pub config: Config,
}

impl AppState {
    pub async fn new(config: Config) -> Self {
        Self {
            config,
        }
    }
}