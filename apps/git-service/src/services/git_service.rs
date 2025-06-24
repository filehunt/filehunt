use bytes::Bytes;
use chrono::Utc;
use base64::Engine as _;

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
            branches: vec!["main".to_string()],
            head_commit: None,
            status: crate::models::RepositoryStatus {
                is_initialized: true,
                has_commits: commits.commits.len() > 0,
                is_syncing: false,
                sync_status: crate::models::SyncStatus::Synced,
                pending_files: 0,
            },
        })
    }

    // Commit operations with realistic Git SHA generation
    pub async fn create_simple_commit(&self, request: CreateCommitRequest) -> Result<Commit> {
        // Validate repository exists
        let mut repository = self.get_repository(&request.repository_id).await?;

        // Process files and create commit files
        let mut commit_files = Vec::new();
        for file_req in &request.files {
            // Decode base64 content
            let content = base64::engine::general_purpose::STANDARD
                .decode(&file_req.content)
                .map_err(|e| GitServiceError::BadRequest(format!("Invalid base64 content: {}", e)))?;
            
            let file_hash = self.s3_service.calculate_file_hash(&content);
            let commit_file = crate::models::CommitFile::new(
                file_req.path.clone(),
                file_hash.clone(),
                content.len() as u64,
                file_req.mode.clone().unwrap_or_default(),
            );

            // Store file content
            let file_key = format!("repositories/{}/files/{}", 
                request.repository_id, file_hash);
            self.s3_service.put_object(&file_key, Bytes::from(content)).await?;
            
            commit_files.push(commit_file);
        }
        
        // Get parent commit (latest commit in repository)
        let parent_commit_ids = if let Some(parent) = &repository.latest_commit_sha {
            vec![parent.clone()]
        } else {
            vec![]
        };

        // Generate realistic Git SHA based on commit content
        let commit_sha = self.generate_commit_sha(
            &request.message,
            &request.author,
            &request.email,
            &commit_files,
            &parent_commit_ids
        );

        // Generate tree SHA
        let tree_sha = self.generate_tree_sha(&commit_files);

        // Create new commit with realistic SHA
        let commit = Commit::new(
            commit_sha,
            request.message,
            request.author,
            request.email,
            commit_files,
            request.repository_id.clone(),
            parent_commit_ids,
            tree_sha,
        );

        // Create commit metadata
        let metadata = CommitMetadata {
            commit: commit.clone(),
            created_at: commit.timestamp,
            local_path: format!("/var/git-repositories/{}", request.repository_id),
            s3_synced: true,
            sync_timestamp: Some(Utc::now()),
        };

        // Store commit metadata
        let metadata_json = serde_json::to_string(&metadata)?;
        self.s3_service.put_object(
            &commit.metadata_key(),
            Bytes::from(metadata_json)
        ).await?;

        // Update repository with latest commit
        repository.latest_commit_sha = Some(commit.id.clone());
        repository.updated_at = Utc::now();
        let repo_json = serde_json::to_string(&repository)?;
        self.s3_service.put_object(
            &repository.metadata_key(),
            Bytes::from(repo_json)
        ).await?;

        Ok(commit)
    }

    // Keep the original method for backwards compatibility
    pub async fn create_commit(&self, request: CreateCommitRequest) -> Result<Commit> {
        self.create_simple_commit(request).await
    }

    pub async fn get_commit(&self, repository_id: &str, commit_id: String) -> Result<Commit> {
        let metadata_key = format!("repositories/{}/commits/{}/meta.json", repository_id, commit_id);
        
        if !self.s3_service.object_exists(&metadata_key).await? {
            return Err(GitServiceError::CommitNotFound(commit_id.to_string()));
        }

        let data = self.s3_service.get_object(&metadata_key).await?;
        let metadata: CommitMetadata = serde_json::from_slice(&data)?;
        
        Ok(metadata.commit)
    }

    pub async fn get_commit_details(&self, repository_id: &str, commit_id: String) -> Result<CommitDetailsResponse> {
        let metadata_key = format!("repositories/{}/commits/{}/meta.json", repository_id, commit_id);
        
        if !self.s3_service.object_exists(&metadata_key).await? {
            return Err(GitServiceError::CommitNotFound(commit_id.to_string()));
        }

        let data = self.s3_service.get_object(&metadata_key).await?;
        let metadata: CommitMetadata = serde_json::from_slice(&data)?;
        
        Ok(CommitDetailsResponse {
            commit: metadata.commit.clone(),
            metadata,
            diff: None,
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
            repository_head: None,
        })
    }

    pub async fn get_commit_file_content(&self, repository_id: &str, commit_id: String) -> Result<Bytes> {
        let commit = self.get_commit(repository_id, commit_id).await?;
        let file_key = if !commit.files.is_empty() {
            format!("{}/{}", commit.storage_key(), commit.files[0].path)
        } else {
            commit.storage_key()
        };
        
        if !self.s3_service.object_exists(&file_key).await? {
            return Err(GitServiceError::FileNotFound(file_key));
        }

        self.s3_service.get_object(&file_key).await
    }

    // Private helper methods for realistic SHA generation
    fn generate_commit_sha(
        &self,
        message: &str,
        author: &str,
        email: &str,
        files: &[crate::models::CommitFile],
        parent_ids: &[String]
    ) -> String {
        use sha1::{Digest, Sha1};
        
        let mut hasher = Sha1::new();
        
        // Hash commit content in Git-like format
        hasher.update(format!("commit {}\0", message.len() + author.len() + email.len()));
        hasher.update(format!("tree {}\n", self.generate_tree_sha(files)));
        
        for parent in parent_ids {
            hasher.update(format!("parent {}\n", parent));
        }
        
        hasher.update(format!("author {} <{}> {}\n", author, email, chrono::Utc::now().timestamp()));
        hasher.update(format!("committer {} <{}> {}\n", author, email, chrono::Utc::now().timestamp()));
        hasher.update("\n");
        hasher.update(message);
        
        hex::encode(hasher.finalize())
    }

    fn generate_tree_sha(&self, files: &[crate::models::CommitFile]) -> String {
        use sha1::{Digest, Sha1};
        
        let mut hasher = Sha1::new();
        
        // Sort files by path for consistent tree SHA
        let mut sorted_files: Vec<_> = files.iter().collect();
        sorted_files.sort_by(|a, b| a.path.cmp(&b.path));
        
        for file in sorted_files {
            hasher.update(format!("blob {}\0{}\n", file.size, file.content_hash));
        }
        
        hex::encode(hasher.finalize())
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