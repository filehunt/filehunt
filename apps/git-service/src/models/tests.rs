#[cfg(test)]
mod tests {
    use crate::models::*;
    use chrono::Utc;
    use uuid::Uuid;

    #[test]
    fn test_commit_new() {
        let commit = Commit::new(
            "Initial commit".to_string(),
            "test@example.com".to_string(),
            "/test/file.txt".to_string(),
            "abc123".to_string(),
            "test_repo".to_string(),
            None,
        );

        assert_eq!(commit.message, "Initial commit");
        assert_eq!(commit.author, "test@example.com");
        assert_eq!(commit.file_path, "/test/file.txt");
        assert_eq!(commit.file_hash, "abc123");
        assert_eq!(commit.repository_id, "test_repo");
        assert_eq!(commit.parent_commit_id, None);
        assert!(!commit.id.to_string().is_empty());
    }

    #[test]
    fn test_commit_with_parent() {
        let parent_id = Uuid::new_v4();
        let commit = Commit::new(
            "Second commit".to_string(),
            "test@example.com".to_string(),
            "/test/file.txt".to_string(),
            "def456".to_string(),
            "test_repo".to_string(),
            Some(parent_id),
        );

        assert_eq!(commit.parent_commit_id, Some(parent_id));
    }

    #[test]
    fn test_commit_storage_keys() {
        let commit = Commit::new(
            "Test commit".to_string(),
            "test@example.com".to_string(),
            "/test/file.txt".to_string(),
            "abc123".to_string(),
            "test_repo".to_string(),
            None,
        );

        let storage_key = commit.storage_key();
        let metadata_key = commit.metadata_key();
        let file_key = commit.file_storage_key();

        assert_eq!(storage_key, format!("repositories/test_repo/commits/{}", commit.id));
        assert_eq!(metadata_key, format!("repositories/test_repo/commits/{}/meta.json", commit.id));
        assert_eq!(file_key, format!("repositories/test_repo/commits/{}/file", commit.id));
    }

    #[test]
    fn test_repository_new() {
        let repo = Repository::new(
            "test-repo".to_string(),
            "testuser".to_string(),
            Some("Test repository".to_string()),
        );

        assert_eq!(repo.id, "testuser_test-repo");
        assert_eq!(repo.name, "test-repo");
        assert_eq!(repo.owner, "testuser");
        assert_eq!(repo.description, Some("Test repository".to_string()));
        assert_eq!(repo.latest_commit_id, None);
        assert!(repo.created_at <= Utc::now());
        assert!(repo.updated_at <= Utc::now());
    }

    #[test]
    fn test_repository_without_description() {
        let repo = Repository::new(
            "test-repo".to_string(),
            "testuser".to_string(),
            None,
        );

        assert_eq!(repo.description, None);
    }

    #[test]
    fn test_repository_storage_keys() {
        let repo = Repository::new(
            "test-repo".to_string(),
            "testuser".to_string(),
            None,
        );

        let prefix = repo.storage_prefix();
        let metadata_key = repo.metadata_key();

        assert_eq!(prefix, "repositories/testuser_test-repo");
        assert_eq!(metadata_key, "repositories/testuser_test-repo/repo_meta.json");
    }

    #[test]
    fn test_commit_serialization() {
        let commit = Commit::new(
            "Test commit".to_string(),
            "test@example.com".to_string(),
            "/test/file.txt".to_string(),
            "abc123".to_string(),
            "test_repo".to_string(),
            None,
        );

        let json = serde_json::to_string(&commit).unwrap();
        let deserialized: Commit = serde_json::from_str(&json).unwrap();

        assert_eq!(commit.id, deserialized.id);
        assert_eq!(commit.message, deserialized.message);
        assert_eq!(commit.author, deserialized.author);
        assert_eq!(commit.file_path, deserialized.file_path);
        assert_eq!(commit.file_hash, deserialized.file_hash);
        assert_eq!(commit.repository_id, deserialized.repository_id);
        assert_eq!(commit.parent_commit_id, deserialized.parent_commit_id);
    }

    #[test]
    fn test_repository_serialization() {
        let repo = Repository::new(
            "test-repo".to_string(),
            "testuser".to_string(),
            Some("Test description".to_string()),
        );

        let json = serde_json::to_string(&repo).unwrap();
        let deserialized: Repository = serde_json::from_str(&json).unwrap();

        assert_eq!(repo.id, deserialized.id);
        assert_eq!(repo.name, deserialized.name);
        assert_eq!(repo.owner, deserialized.owner);
        assert_eq!(repo.description, deserialized.description);
        assert_eq!(repo.latest_commit_id, deserialized.latest_commit_id);
    }

    #[test]
    fn test_create_commit_request_serialization() {
        let request = CreateCommitRequest {
            message: "Test commit".to_string(),
            author: "test@example.com".to_string(),
            file_path: "/test/file.txt".to_string(),
            repository_id: "test_repo".to_string(),
        };

        let json = serde_json::to_string(&request).unwrap();
        let deserialized: CreateCommitRequest = serde_json::from_str(&json).unwrap();

        assert_eq!(request.message, deserialized.message);
        assert_eq!(request.author, deserialized.author);
        assert_eq!(request.file_path, deserialized.file_path);
        assert_eq!(request.repository_id, deserialized.repository_id);
    }

    #[test]
    fn test_create_repository_request_serialization() {
        let request = CreateRepositoryRequest {
            name: "test-repo".to_string(),
            owner: "testuser".to_string(),
            description: Some("Test description".to_string()),
        };

        let json = serde_json::to_string(&request).unwrap();
        let deserialized: CreateRepositoryRequest = serde_json::from_str(&json).unwrap();

        assert_eq!(request.name, deserialized.name);
        assert_eq!(request.owner, deserialized.owner);
        assert_eq!(request.description, deserialized.description);
    }

    #[test]
    fn test_commit_metadata_serialization() {
        let commit = Commit::new(
            "Test commit".to_string(),
            "test@example.com".to_string(),
            "/test/file.txt".to_string(),
            "abc123".to_string(),
            "test_repo".to_string(),
            None,
        );

        let metadata = CommitMetadata {
            commit: commit.clone(),
            created_at: commit.timestamp,
            storage_path: commit.file_storage_key(),
        };

        let json = serde_json::to_string(&metadata).unwrap();
        let deserialized: CommitMetadata = serde_json::from_str(&json).unwrap();

        assert_eq!(metadata.commit.id, deserialized.commit.id);
        assert_eq!(metadata.created_at, deserialized.created_at);
        assert_eq!(metadata.storage_path, deserialized.storage_path);
    }

    #[test]
    fn test_commit_list_response() {
        let commit1 = Commit::new(
            "First commit".to_string(),
            "test@example.com".to_string(),
            "/test/file1.txt".to_string(),
            "abc123".to_string(),
            "test_repo".to_string(),
            None,
        );

        let commit2 = Commit::new(
            "Second commit".to_string(),
            "test@example.com".to_string(),
            "/test/file2.txt".to_string(),
            "def456".to_string(),
            "test_repo".to_string(),
            Some(commit1.id),
        );

        let response = CommitListResponse {
            commits: vec![commit1, commit2],
            total: 2,
        };

        assert_eq!(response.commits.len(), 2);
        assert_eq!(response.total, 2);
        assert_eq!(response.commits[0].message, "First commit");
        assert_eq!(response.commits[1].message, "Second commit");
    }

    #[test]
    fn test_repository_response() {
        let repo = Repository::new(
            "test-repo".to_string(),
            "testuser".to_string(),
            Some("Test description".to_string()),
        );

        let response = RepositoryResponse {
            repository: repo.clone(),
            commit_count: 5,
        };

        assert_eq!(response.repository.id, repo.id);
        assert_eq!(response.commit_count, 5);
    }

    #[test]
    fn test_commit_details_response() {
        let commit = Commit::new(
            "Test commit".to_string(),
            "test@example.com".to_string(),
            "/test/file.txt".to_string(),
            "abc123".to_string(),
            "test_repo".to_string(),
            None,
        );

        let metadata = CommitMetadata {
            commit: commit.clone(),
            created_at: commit.timestamp,
            storage_path: commit.file_storage_key(),
        };

        let response = CommitDetailsResponse {
            commit: commit.clone(),
            metadata: metadata.clone(),
        };

        assert_eq!(response.commit.id, commit.id);
        assert_eq!(response.metadata.commit.id, commit.id);
        assert_eq!(response.metadata.storage_path, metadata.storage_path);
    }
}