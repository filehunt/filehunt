use git2::{Repository as GitRepo, Signature, Oid, ObjectType};
use std::path::{Path, PathBuf};

use tokio::fs as async_fs;
use chrono::Utc;
use base64::Engine as _;
use flate2::write::GzEncoder;
use flate2::read::GzDecoder;
use flate2::Compression;
use tar::{Archive, Builder};
use walkdir::WalkDir;

use crate::models::{
    Commit, CommitFile, CommitMetadata, FileMode,
    CreateCommitRequest, CreateCommitFile, FileUploadRequest,
    GitServiceError, Result
};
use shared_rust::s3::{S3Service, config::S3BucketType};

pub struct GitRepositoryService {
    local_repo_path: PathBuf,
    s3_service: S3Service,
    git_repo: Option<GitRepo>,
    repository_id: String,
}

impl GitRepositoryService {
    pub fn new(repository_id: String, s3_service: S3Service) -> Self {
        let local_repo_path = PathBuf::from("/var/git-repositories").join(&repository_id);
        
        Self {
            local_repo_path,
            s3_service,
            git_repo: None,
            repository_id,
        }
    }

    pub async fn init_repository(&mut self) -> Result<()> {
        // Create directory if it doesn't exist
        if let Some(parent) = self.local_repo_path.parent() {
            async_fs::create_dir_all(parent).await
                .map_err(|e| GitServiceError::InternalError(format!("Failed to create repo directory: {}", e)))?;
        }

        // Initialize Git repository
        let repo = GitRepo::init(&self.local_repo_path)
            .map_err(|e| GitServiceError::InternalError(format!("Failed to init Git repo: {}", e)))?;

        // Create initial commit with README
        self.create_initial_commit(&repo).await?;
        
        self.git_repo = Some(repo);
        
        tracing::info!("Initialized Git repository at: {:?}", self.local_repo_path);
        Ok(())
    }

    pub async fn open_repository(&mut self) -> Result<()> {
        if self.local_repo_path.exists() {
            let repo = GitRepo::open(&self.local_repo_path)
                .map_err(|e| GitServiceError::InternalError(format!("Failed to open Git repo: {}", e)))?;
            
            self.git_repo = Some(repo);
            tracing::info!("Opened existing Git repository at: {:?}", self.local_repo_path);
        } else {
            // Try to restore from S3 first
            if self.s3_service.object_exists(S3BucketType::GitRepositories, &self.git_archive_key()).await? {
                self.restore_from_s3().await?;
                let repo = GitRepo::open(&self.local_repo_path)
                    .map_err(|e| GitServiceError::InternalError(format!("Failed to open restored repo: {}", e)))?;
                self.git_repo = Some(repo);
            } else {
                // Initialize new repository
                self.init_repository().await?;
            }
        }
        Ok(())
    }

    pub async fn create_commit_from_files(&mut self, request: CreateCommitRequest) -> Result<Commit> {
        let repo = self.get_repo()?;
        
        // Decode and write files to working directory
        let mut commit_files = Vec::new();
        
        for file_request in &request.files {
            let file_path = self.local_repo_path.join(&file_request.path);
            
            // Create parent directories
            if let Some(parent) = file_path.parent() {
                async_fs::create_dir_all(parent).await
                    .map_err(|e| GitServiceError::InternalError(format!("Failed to create file directory: {}", e)))?;
            }

            // Decode base64 content
            let content = base64::engine::general_purpose::STANDARD
                .decode(&file_request.content)
                .map_err(|e| GitServiceError::BadRequest(format!("Invalid base64 content: {}", e)))?;

            // Write file
            async_fs::write(&file_path, &content).await
                .map_err(|e| GitServiceError::InternalError(format!("Failed to write file: {}", e)))?;

            // Calculate hash
            let hash = self.s3_service.calculate_file_hash(&content);
            
            let commit_file = CommitFile::new(
                file_request.path.clone(),
                hash,
                content.len() as u64,
                file_request.mode.clone().unwrap_or_default(),
            );
            
            commit_files.push(commit_file);
        }

        // Add files to Git index
        let mut index = repo.index()
            .map_err(|e| GitServiceError::InternalError(format!("Failed to get Git index: {}", e)))?;

        for file_request in &request.files {
            index.add_path(Path::new(&file_request.path))
                .map_err(|e| GitServiceError::InternalError(format!("Failed to add file to index: {}", e)))?;
        }

        index.write()
            .map_err(|e| GitServiceError::InternalError(format!("Failed to write index: {}", e)))?;

        // Create tree
        let tree_id = index.write_tree()
            .map_err(|e| GitServiceError::InternalError(format!("Failed to write tree: {}", e)))?;

        let tree = repo.find_tree(tree_id)
            .map_err(|e| GitServiceError::InternalError(format!("Failed to find tree: {}", e)))?;

        // Get parent commits
        let mut parent_commits = Vec::new();
        let mut parent_shas = Vec::new();
        
        if let Ok(head) = repo.head() {
            if let Ok(commit) = head.peel_to_commit() {
                parent_shas.push(commit.id().to_string());
                parent_commits.push(commit);
            }
        }

        // Create signature
        let signature = Signature::now(&request.author, &request.email)
            .map_err(|e| GitServiceError::InternalError(format!("Failed to create signature: {}", e)))?;

        // Create commit
        let parent_refs: Vec<&git2::Commit> = parent_commits.iter().collect();

        let commit_id = repo.commit(
            Some("HEAD"),
            &signature,
            &signature,
            &request.message,
            &tree,
            &parent_refs,
        ).map_err(|e| GitServiceError::InternalError(format!("Failed to create commit: {}", e)))?;

        // Create Commit model
        let commit = Commit::new(
            commit_id.to_string(),
            request.message,
            request.author,
            request.email,
            commit_files,
            self.repository_id.clone(),
            parent_shas,
            tree_id.to_string(),
        );

        // Save commit metadata
        self.save_commit_metadata(&commit).await?;

        // Trigger background sync to S3
        tokio::spawn(async move {
            // TODO: Implement background sync
        });

        tracing::info!("Created commit {} with {} files", commit_id, commit.files.len());
        
        Ok(commit)
    }

    pub async fn handle_file_uploads(&mut self, request: FileUploadRequest) -> Result<Commit> {
        // TODO: Integration with file-service
        // For now, create a placeholder commit
        
        let commit_message = request.commit_message
            .unwrap_or_else(|| format!("Upload {} files", request.files.len()));

        let mut commit_files = Vec::new();
        
        for file_upload in &request.files {
            // TODO: Get file content from file-service using file_upload.file_service_id
            tracing::info!("TODO: Fetch file {} from file-service", file_upload.file_service_id);
            
            // Placeholder file
            let content = format!("File from file-service: {}", file_upload.file_service_id);
            let file_path = self.local_repo_path.join(&file_upload.target_path);
            
            if let Some(parent) = file_path.parent() {
                async_fs::create_dir_all(parent).await
                    .map_err(|e| GitServiceError::InternalError(format!("Failed to create directory: {}", e)))?;
            }

            async_fs::write(&file_path, &content).await
                .map_err(|e| GitServiceError::InternalError(format!("Failed to write file: {}", e)))?;

            let hash = self.s3_service.calculate_file_hash(content.as_bytes());
            
            let commit_file = CommitFile::new(
                file_upload.target_path.clone(),
                hash,
                content.len() as u64,
                file_upload.mode.clone().unwrap_or_default(),
            );
            
            commit_files.push(commit_file);
        }

        // Create commit request
        let create_request = CreateCommitRequest {
            message: commit_message,
            author: "File Service".to_string(),
            email: "files@filehunt.com".to_string(),
            files: request.files.iter().map(|f| CreateCommitFile {
                path: f.target_path.clone(),
                content: base64::engine::general_purpose::STANDARD.encode("placeholder"),
                mode: f.mode.clone(),
            }).collect(),
            repository_id: request.repository_id,
        };

        self.create_commit_from_files(create_request).await
    }

    pub async fn get_commit_history(&self, limit: Option<usize>, offset: Option<usize>) -> Result<Vec<Commit>> {
        let repo = self.get_repo()?;
        
        let mut revwalk = repo.revwalk()
            .map_err(|e| GitServiceError::InternalError(format!("Failed to create revwalk: {}", e)))?;
        
        revwalk.push_head()
            .map_err(|e| GitServiceError::InternalError(format!("Failed to push head: {}", e)))?;
        
        let limit = limit.unwrap_or(50);
        let offset = offset.unwrap_or(0);
        
        let mut commits = Vec::new();
        let mut count = 0;
        
        for commit_id in revwalk {
            if count < offset {
                count += 1;
                continue;
            }
            
            if commits.len() >= limit {
                break;
            }
            
            let commit_id = commit_id
                .map_err(|e| GitServiceError::InternalError(format!("Failed to get commit ID: {}", e)))?;
            
            let git_commit = repo.find_commit(commit_id)
                .map_err(|e| GitServiceError::InternalError(format!("Failed to find commit: {}", e)))?;
            
            let commit = self.git_commit_to_model(&git_commit)?;
            commits.push(commit);
            count += 1;
        }
        
        Ok(commits)
    }

    pub async fn get_commit_by_sha(&self, sha: &str) -> Result<Commit> {
        let repo = self.get_repo()?;
        
        let oid = Oid::from_str(sha)
            .map_err(|e| GitServiceError::BadRequest(format!("Invalid commit SHA: {}", e)))?;
        
        let git_commit = repo.find_commit(oid)
            .map_err(|_e| GitServiceError::CommitNotFound(sha.to_string()))?;
        
        self.git_commit_to_model(&git_commit)
    }

    pub async fn sync_to_s3(&self) -> Result<()> {
        // Create tar.gz archive of the Git repository
        let archive_path = format!("/tmp/{}_archive.tar.gz", self.repository_id);
        self.create_git_archive(&archive_path).await?;
        
        // Upload to S3
        let archive_content = async_fs::read(&archive_path).await
            .map_err(|e| GitServiceError::InternalError(format!("Failed to read archive: {}", e)))?;
        
        self.s3_service.put_object(
            S3BucketType::GitRepositories,
            &self.git_archive_key(),
            bytes::Bytes::from(archive_content)
        ).await?;
        
        // Cleanup
        let _ = async_fs::remove_file(&archive_path).await;
        
        tracing::info!("Synced repository {} to S3", self.repository_id);
        Ok(())
    }

    pub async fn restore_from_s3(&self) -> Result<()> {
        // Download archive from S3
        let archive_content = self.s3_service.get_object(S3BucketType::GitRepositories, &self.git_archive_key()).await?;
        
        // Extract archive
        let archive_path = format!("/tmp/{}_restore.tar.gz", self.repository_id);
        async_fs::write(&archive_path, &archive_content).await
            .map_err(|e| GitServiceError::InternalError(format!("Failed to write archive: {}", e)))?;
        
        self.extract_git_archive(&archive_path).await?;
        
        // Cleanup
        let _ = async_fs::remove_file(&archive_path).await;
        
        tracing::info!("Restored repository {} from S3", self.repository_id);
        Ok(())
    }

    // Private helper methods
    fn get_repo(&self) -> Result<&GitRepo> {
        self.git_repo.as_ref()
            .ok_or_else(|| GitServiceError::InternalError("Git repository not initialized".to_string()))
    }

    async fn create_initial_commit(&self, repo: &GitRepo) -> Result<()> {
        // Create README.md
        let readme_path = self.local_repo_path.join("README.md");
        let readme_content = format!("# {}\n\nRepository created by FileHunt Git Service\n", self.repository_id);
        
        async_fs::write(&readme_path, readme_content).await
            .map_err(|e| GitServiceError::InternalError(format!("Failed to write README: {}", e)))?;

        // Add to index
        let mut index = repo.index()
            .map_err(|e| GitServiceError::InternalError(format!("Failed to get index: {}", e)))?;
        
        index.add_path(Path::new("README.md"))
            .map_err(|e| GitServiceError::InternalError(format!("Failed to add README: {}", e)))?;
        
        index.write()
            .map_err(|e| GitServiceError::InternalError(format!("Failed to write index: {}", e)))?;

        // Create tree
        let tree_id = index.write_tree()
            .map_err(|e| GitServiceError::InternalError(format!("Failed to write tree: {}", e)))?;
        
        let tree = repo.find_tree(tree_id)
            .map_err(|e| GitServiceError::InternalError(format!("Failed to find tree: {}", e)))?;

        // Create signature
        let signature = Signature::now("FileHunt", "noreply@filehunt.com")
            .map_err(|e| GitServiceError::InternalError(format!("Failed to create signature: {}", e)))?;

        // Create initial commit
        repo.commit(
            Some("HEAD"),
            &signature,
            &signature,
            "Initial commit",
            &tree,
            &[],
        ).map_err(|e| GitServiceError::InternalError(format!("Failed to create initial commit: {}", e)))?;

        Ok(())
    }

    fn git_commit_to_model(&self, git_commit: &git2::Commit) -> Result<Commit> {
        let tree = git_commit.tree()
            .map_err(|e| GitServiceError::InternalError(format!("Failed to get commit tree: {}", e)))?;
        
        let mut files = Vec::new();
        
        // Walk the tree to get all files
        tree.walk(git2::TreeWalkMode::PreOrder, |root, entry| {
            if let Some(name) = entry.name() {
                let path = if root.is_empty() {
                    name.to_string()
                } else {
                    format!("{}/{}", root, name)
                };
                
                if entry.kind() == Some(ObjectType::Blob) {
                    let file = CommitFile::new(
                        path,
                        entry.id().to_string(),
                        0, // TODO: Get actual file size
                        FileMode::File, // Simplified for now
                    );
                    files.push(file);
                }
            }
            git2::TreeWalkResult::Ok
        }).map_err(|e| GitServiceError::InternalError(format!("Failed to walk tree: {}", e)))?;

        let parent_shas: Vec<String> = git_commit.parent_ids().map(|id| id.to_string()).collect();

        let commit = Commit::new(
            git_commit.id().to_string(),
            git_commit.message().unwrap_or("").to_string(),
            git_commit.author().name().unwrap_or("Unknown").to_string(),
            git_commit.author().email().unwrap_or("unknown@example.com").to_string(),
            files,
            self.repository_id.clone(),
            parent_shas,
            tree.id().to_string(),
        );

        Ok(commit)
    }

    async fn save_commit_metadata(&self, commit: &Commit) -> Result<()> {
        let metadata = CommitMetadata {
            commit: commit.clone(),
            created_at: Utc::now(),
            local_path: self.local_repo_path.to_string_lossy().to_string(),
            s3_synced: false,
            sync_timestamp: None,
        };

        let metadata_json = serde_json::to_string(&metadata)?;
        let metadata_key = format!("repositories/{}/commits/{}/meta.json", self.repository_id, commit.id);
        
        self.s3_service.put_object(
            S3BucketType::GitRepositories,
            &metadata_key,
            bytes::Bytes::from(metadata_json)
        ).await?;

        Ok(())
    }

    async fn create_git_archive(&self, archive_path: &str) -> Result<()> {
        let file = std::fs::File::create(archive_path)
            .map_err(|e| GitServiceError::InternalError(format!("Failed to create archive file: {}", e)))?;
        
        let encoder = GzEncoder::new(file, Compression::default());
        let mut tar = Builder::new(encoder);
        
        for entry in WalkDir::new(&self.local_repo_path) {
            let entry = entry
                .map_err(|e| GitServiceError::InternalError(format!("Failed to walk directory: {}", e)))?;
            
            let path = entry.path();
            if path.is_file() {
                let relative_path = path.strip_prefix(&self.local_repo_path)
                    .map_err(|e| GitServiceError::InternalError(format!("Failed to get relative path: {}", e)))?;
                
                tar.append_path_with_name(path, relative_path)
                    .map_err(|e| GitServiceError::InternalError(format!("Failed to add file to archive: {}", e)))?;
            }
        }
        
        tar.finish()
            .map_err(|e| GitServiceError::InternalError(format!("Failed to finish archive: {}", e)))?;
        
        Ok(())
    }

    async fn extract_git_archive(&self, archive_path: &str) -> Result<()> {
        let file = std::fs::File::open(archive_path)
            .map_err(|e| GitServiceError::InternalError(format!("Failed to open archive: {}", e)))?;
        
        let decoder = GzDecoder::new(file);
        let mut archive = Archive::new(decoder);
        
        // Create parent directory
        if let Some(parent) = self.local_repo_path.parent() {
            async_fs::create_dir_all(parent).await
                .map_err(|e| GitServiceError::InternalError(format!("Failed to create parent dir: {}", e)))?;
        }
        
        archive.unpack(&self.local_repo_path)
            .map_err(|e| GitServiceError::InternalError(format!("Failed to extract archive: {}", e)))?;
        
        Ok(())
    }

    fn git_archive_key(&self) -> String {
        format!("repositories/{}/git_archive.tar.gz", self.repository_id)
    }
}