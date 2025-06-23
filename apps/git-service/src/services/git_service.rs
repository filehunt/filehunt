use bytes::Bytes;
use chrono::Utc;
use uuid::Uuid;

use crate::models::{
    Commit, CommitMetadata, Repository, CreateCommitRequest, CreateRepositoryRequest,
    CommitListResponse, CommitDetailsResponse, RepositoryResponse, GitServiceError, Result
};
use crate::services::s3_service::S3Service;

pub struct GitService {
    s3_service: S3Service,
}

impl GitService {
    pub fn new(s3_service: S3Service) -> Self {
        Self { s3_service }
    }

    // Repository operations
    pub async fn create_repository(&self, request: CreateRepositoryRequest) -> Result<Repository> {
        let repository = Repository::new(request.name, request.owner, request.description);
        
        // Check if repository already exists
        if self.s3_service.object_exists(&repository.metadata_key()).await? {
            return Err(GitServiceError::RepositoryAlreadyExists(repository.id.clone()));
        }

        // Save repository metadata
        let repo_json = serde_json::to_string(&repository)?;
        self.s3_service.put_object(
            &repository.metadata_key(),
            Bytes::from(repo_json)
        ).await?;

        Ok(repository)
    }

    pub async fn get_repository(&self, repository_id: &str) -> Result<Repository> {
        let metadata_key = format!("repositories/{}/repo_meta.json", repository_id);
        
        if !self.s3_service.object_exists(&metadata_key).await? {
            return Err(GitServiceError::RepositoryNotFound(repository_id.to_string()));
        }

        let data = self.s3_service.get_object(&metadata_key).await?;
        let repository: Repository = serde_json::from_slice(&data)?;
        
        Ok(repository)
    }

    pub async fn get_repository_with_stats(&self, repository_id: &str) -> Result<RepositoryResponse> {
        let repository = self.get_repository(repository_id).await?;
        let commits = self.list_commits(repository_id, None, None).await?;
        
        Ok(RepositoryResponse {
            repository,
            commit_count: commits.commits.len(),
        })
    }

    // Commit operations
    pub async fn create_commit(&self, request: CreateCommitRequest) -> Result<Commit> {
        // Validate repository exists
        let mut repository = self.get_repository(&request.repository_id).await?;

        // TODO: call file-service here to get file content and verify file exists
        // For now, we'll simulate getting file content
        let file_content = self.get_file_content_from_file_service(&request.file_path).await?;
        
        // Calculate file hash
        let file_hash = self.s3_service.calculate_file_hash(&file_content);

        // Get parent commit (latest commit in repository)
        let parent_commit_id = repository.latest_commit_id;

        // Create new commit
        let commit = Commit::new(
            request.message,
            request.author,
            request.file_path.clone(),
            file_hash,
            request.repository_id.clone(),
            parent_commit_id,
        );

        // Store file in versioned location
        self.s3_service.put_object(
            &commit.file_storage_key(),
            Bytes::from(file_content)
        ).await?;

        // Create commit metadata
        let metadata = CommitMetadata {
            commit: commit.clone(),
            created_at: commit.timestamp,
            storage_path: commit.file_storage_key(),
        };

        // Store commit metadata
        let metadata_json = serde_json::to_string(&metadata)?;
        self.s3_service.put_object(
            &commit.metadata_key(),
            Bytes::from(metadata_json)
        ).await?;

        // Update repository with latest commit
        repository.latest_commit_id = Some(commit.id);
        repository.updated_at = Utc::now();
        let repo_json = serde_json::to_string(&repository)?;
        self.s3_service.put_object(
            &repository.metadata_key(),
            Bytes::from(repo_json)
        ).await?;

        Ok(commit)
    }

    pub async fn get_commit(&self, repository_id: &str, commit_id: Uuid) -> Result<Commit> {
        let metadata_key = format!("repositories/{}/commits/{}/meta.json", repository_id, commit_id);
        
        if !self.s3_service.object_exists(&metadata_key).await? {
            return Err(GitServiceError::CommitNotFound(commit_id.to_string()));
        }

        let data = self.s3_service.get_object(&metadata_key).await?;
        let metadata: CommitMetadata = serde_json::from_slice(&data)?;
        
        Ok(metadata.commit)
    }

    pub async fn get_commit_details(&self, repository_id: &str, commit_id: Uuid) -> Result<CommitDetailsResponse> {
        let metadata_key = format!("repositories/{}/commits/{}/meta.json", repository_id, commit_id);
        
        if !self.s3_service.object_exists(&metadata_key).await? {
            return Err(GitServiceError::CommitNotFound(commit_id.to_string()));
        }

        let data = self.s3_service.get_object(&metadata_key).await?;
        let metadata: CommitMetadata = serde_json::from_slice(&data)?;
        
        Ok(CommitDetailsResponse {
            commit: metadata.commit.clone(),
            metadata,
        })
    }

    pub async fn list_commits(
        &self, 
        repository_id: &str, 
        limit: Option<usize>, 
        offset: Option<usize>
    ) -> Result<CommitListResponse> {
        // Validate repository exists
        self.get_repository(repository_id).await?;

        let prefix = format!("repositories/{}/commits/", repository_id);
        let keys = self.s3_service.list_objects_with_prefix(&prefix).await?;

        // Filter only metadata files
        let metadata_keys: Vec<String> = keys
            .into_iter()
            .filter(|key| key.ends_with("/meta.json"))
            .collect();

        let mut commits = Vec::new();

        // Load each commit metadata
        for key in metadata_keys {
            if let Ok(data) = self.s3_service.get_object(&key).await {
                if let Ok(metadata) = serde_json::from_slice::<CommitMetadata>(&data) {
                    commits.push(metadata.commit);
                }
            }
        }

        // Sort by timestamp (newest first)
        commits.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));

        let total = commits.len();
        
        // Apply pagination
        let offset = offset.unwrap_or(0);
        let limit = limit.unwrap_or(50);
        
        let paginated_commits: Vec<Commit> = commits
            .into_iter()
            .skip(offset)
            .take(limit)
            .collect();

        Ok(CommitListResponse {
            commits: paginated_commits,
            total,
        })
    }

    pub async fn get_commit_file_content(&self, repository_id: &str, commit_id: Uuid) -> Result<Bytes> {
        let commit = self.get_commit(repository_id, commit_id).await?;
        let file_key = commit.file_storage_key();
        
        if !self.s3_service.object_exists(&file_key).await? {
            return Err(GitServiceError::FileNotFound(file_key));
        }

        self.s3_service.get_object(&file_key).await
    }

    // Private helper methods
    async fn get_file_content_from_file_service(&self, file_path: &str) -> Result<Vec<u8>> {
        // TODO: call file-service here to get actual file content
        // For now, return a placeholder implementation
        tracing::warn!("TODO: Implement file-service integration for file: {}", file_path);
        
        // Simulate file content for development
        Ok(format!("File content for: {}", file_path).into_bytes())
    }

    // Health check methods
    pub async fn health_check(&self) -> Result<()> {
        // Try to list objects in the bucket to verify S3 connectivity
        let _ = self.s3_service.list_objects_with_prefix("health_check/").await?;
        Ok(())
    }

    // Repository listing (for admin purposes)
    pub async fn list_repositories(&self) -> Result<Vec<Repository>> {
        let prefix = "repositories/";
        let keys = self.s3_service.list_objects_with_prefix(prefix).await?;

        let metadata_keys: Vec<String> = keys
            .into_iter()
            .filter(|key| key.ends_with("/repo_meta.json"))
            .collect();

        let mut repositories = Vec::new();

        for key in metadata_keys {
            if let Ok(data) = self.s3_service.get_object(&key).await {
                if let Ok(repository) = serde_json::from_slice::<Repository>(&data) {
                    repositories.push(repository);
                }
            }
        }

        // Sort by creation date (newest first)
        repositories.sort_by(|a, b| b.created_at.cmp(&a.created_at));

        Ok(repositories)
    }
}