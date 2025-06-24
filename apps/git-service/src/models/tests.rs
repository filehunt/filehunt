#[cfg(test)]
mod tests {
    use crate::models::*;
    use chrono::Utc;

    #[test]
    fn test_commit_new() {
        let files = vec![
            CommitFile::new(
                "src/main.rs".to_string(),
                "abc123".to_string(),
                1024,
                FileMode::File,
            ),
        ];

        let commit = Commit::new(
            "sha1234567890abcdef".to_string(),
            "Initial commit".to_string(),
            "John Doe".to_string(),
            "john@example.com".to_string(),
            files.clone(),
            "test_repo".to_string(),
            vec![],
            "tree_sha123".to_string(),
        );

        assert_eq!(commit.id, "sha1234567890abcdef");
        assert_eq!(commit.message, "Initial commit");
        assert_eq!(commit.author, "John Doe");
        assert_eq!(commit.email, "john@example.com");
        assert_eq!(commit.repository_id, "test_repo");
        assert_eq!(commit.parent_commit_ids.len(), 0);
        assert_eq!(commit.tree_sha, "tree_sha123");
        assert_eq!(commit.files.len(), 1);
        assert_eq!(commit.files[0].path, "src/main.rs");
    }

    #[test]
    fn test_commit_with_parent() {
        let files = vec![
            CommitFile::new(
                "README.md".to_string(),
                "def456".to_string(),
                512,
                FileMode::File,
            ),
        ];

        let parent_ids = vec!["parent_sha123".to_string()];
        let commit = Commit::new(
            "sha2345678901bcdefg".to_string(),
            "Second commit".to_string(),
            "Jane Smith".to_string(),
            "jane@example.com".to_string(),
            files,
            "test_repo".to_string(),
            parent_ids.clone(),
            "tree_sha456".to_string(),
        );

        assert_eq!(commit.parent_commit_ids, parent_ids);
        assert!(!commit.is_merge_commit());
    }

    #[test]
    fn test_merge_commit() {
        let files = vec![
            CommitFile::new(
                "merged_file.txt".to_string(),
                "merge123".to_string(),
                256,
                FileMode::File,
            ),
        ];

        let parent_ids = vec!["parent1_sha".to_string(), "parent2_sha".to_string()];
        let commit = Commit::new(
            "merge_sha123".to_string(),
            "Merge branch 'feature'".to_string(),
            "Developer".to_string(),
            "dev@example.com".to_string(),
            files,
            "test_repo".to_string(),
            parent_ids,
            "merge_tree_sha".to_string(),
        );

        assert!(commit.is_merge_commit());
        assert_eq!(commit.parent_commit_ids.len(), 2);
    }

    #[test]
    fn test_commit_storage_keys() {
        let files = vec![
            CommitFile::new(
                "test.txt".to_string(),
                "test123".to_string(),
                100,
                FileMode::File,
            ),
        ];

        let commit = Commit::new(
            "test_sha123".to_string(),
            "Test commit".to_string(),
            "Tester".to_string(),
            "test@example.com".to_string(),
            files,
            "test_repo".to_string(),
            vec![],
            "test_tree_sha".to_string(),
        );

        let storage_key = commit.storage_key();
        let metadata_key = commit.metadata_key();

        assert_eq!(storage_key, "repositories/test_repo/commits/test_sha123");
        assert_eq!(metadata_key, "repositories/test_repo/commits/test_sha123/meta.json");
    }

    #[test]
    fn test_commit_file_properties() {
        let files = vec![
            CommitFile::new(
                "image.jpg".to_string(),
                "img123".to_string(),
                2048,
                FileMode::File,
            ),
            CommitFile::new(
                "script.sh".to_string(),
                "script456".to_string(),
                1024,
                FileMode::Executable,
            ),
        ];

        let commit = Commit::new(
            "file_test_sha".to_string(),
            "Add files".to_string(),
            "Author".to_string(),
            "author@example.com".to_string(),
            files,
            "test_repo".to_string(),
            vec![],
            "file_tree_sha".to_string(),
        );

        assert_eq!(commit.file_count(), 2);
        assert_eq!(commit.total_size(), 3072);
        assert!(commit.files[0].is_binary());
        assert!(!commit.files[1].is_binary());
    }

    #[test]
    fn test_repository_new() {
        let repo = Repository::new(
            "test-repo".to_string(),
            "testuser".to_string(),
            Some("Test repository".to_string()),
        );

        assert_eq!(repo.name, "test-repo");
        assert_eq!(repo.owner, "testuser");
        assert_eq!(repo.description, Some("Test repository".to_string()));
        assert_eq!(repo.latest_commit_sha, None);
        assert!(repo.created_at <= Utc::now());
        assert!(repo.updated_at <= Utc::now());
        assert!(!repo.id.is_empty());
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

        assert!(prefix.starts_with("repositories/"));
        assert!(metadata_key.ends_with("/repo_meta.json"));
    }

    #[test]
    fn test_commit_serialization() {
        let files = vec![
            CommitFile::new(
                "test.txt".to_string(),
                "abc123".to_string(),
                512,
                FileMode::File,
            ),
        ];

        let commit = Commit::new(
            "serialize_test_sha".to_string(),
            "Test commit".to_string(),
            "Author".to_string(),
            "author@example.com".to_string(),
            files,
            "test_repo".to_string(),
            vec!["parent_sha".to_string()],
            "tree_sha789".to_string(),
        );

        let json = serde_json::to_string(&commit).unwrap();
        let deserialized: Commit = serde_json::from_str(&json).unwrap();

        assert_eq!(commit.id, deserialized.id);
        assert_eq!(commit.message, deserialized.message);
        assert_eq!(commit.author, deserialized.author);
        assert_eq!(commit.email, deserialized.email);
        assert_eq!(commit.repository_id, deserialized.repository_id);
        assert_eq!(commit.parent_commit_ids, deserialized.parent_commit_ids);
        assert_eq!(commit.tree_sha, deserialized.tree_sha);
        assert_eq!(commit.files.len(), deserialized.files.len());
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
        assert_eq!(repo.latest_commit_sha, deserialized.latest_commit_sha);
    }

    #[test]
    fn test_create_commit_request_serialization() {
        let files = vec![
            CreateCommitFile {
                path: "test.txt".to_string(),
                content: "dGVzdCBjb250ZW50".to_string(), // "test content" in base64
                mode: Some(FileMode::File),
            },
        ];

        let request = CreateCommitRequest {
            message: "Test commit".to_string(),
            author: "Author".to_string(),
            email: "author@example.com".to_string(),
            files,
            repository_id: "test_repo".to_string(),
        };

        let json = serde_json::to_string(&request).unwrap();
        let deserialized: CreateCommitRequest = serde_json::from_str(&json).unwrap();

        assert_eq!(request.message, deserialized.message);
        assert_eq!(request.author, deserialized.author);
        assert_eq!(request.email, deserialized.email);
        assert_eq!(request.repository_id, deserialized.repository_id);
        assert_eq!(request.files.len(), deserialized.files.len());
        assert_eq!(request.files[0].path, deserialized.files[0].path);
    }

    #[test]
    fn test_commit_metadata_serialization() {
        let files = vec![
            CommitFile::new(
                "test.txt".to_string(),
                "abc123".to_string(),
                256,
                FileMode::File,
            ),
        ];

        let commit = Commit::new(
            "metadata_test_sha".to_string(),
            "Test commit".to_string(),
            "Author".to_string(),
            "author@example.com".to_string(),
            files,
            "test_repo".to_string(),
            vec![],
            "meta_tree_sha".to_string(),
        );

        let metadata = CommitMetadata {
            commit: commit.clone(),
            created_at: commit.timestamp,
            local_path: "/tmp/test".to_string(),
            s3_synced: true,
            sync_timestamp: Some(Utc::now()),
        };

        let json = serde_json::to_string(&metadata).unwrap();
        let deserialized: CommitMetadata = serde_json::from_str(&json).unwrap();

        assert_eq!(metadata.commit.id, deserialized.commit.id);
        assert_eq!(metadata.created_at, deserialized.created_at);
        assert_eq!(metadata.local_path, deserialized.local_path);
        assert_eq!(metadata.s3_synced, deserialized.s3_synced);
    }

    #[test]
    fn test_file_mode_conversions() {
        assert_eq!(FileMode::File.to_git_filemode(), git2::FileMode::Blob);
        assert_eq!(FileMode::Executable.to_git_filemode(), git2::FileMode::BlobExecutable);
        assert_eq!(FileMode::Symlink.to_git_filemode(), git2::FileMode::Link);
        assert_eq!(FileMode::Directory.to_git_filemode(), git2::FileMode::Tree);

        assert_eq!(FileMode::from_git_filemode(git2::FileMode::Blob), FileMode::File);
        assert_eq!(FileMode::from_git_filemode(git2::FileMode::BlobExecutable), FileMode::Executable);
        assert_eq!(FileMode::from_git_filemode(git2::FileMode::Link), FileMode::Symlink);
        assert_eq!(FileMode::from_git_filemode(git2::FileMode::Tree), FileMode::Directory);
    }

    #[test]
    fn test_commit_list_response() {
        let files1 = vec![
            CommitFile::new(
                "file1.txt".to_string(),
                "hash1".to_string(),
                100,
                FileMode::File,
            ),
        ];

        let files2 = vec![
            CommitFile::new(
                "file2.txt".to_string(),
                "hash2".to_string(),
                200,
                FileMode::File,
            ),
        ];

        let commit1 = Commit::new(
            "commit1_sha".to_string(),
            "First commit".to_string(),
            "Author1".to_string(),
            "author1@example.com".to_string(),
            files1,
            "test_repo".to_string(),
            vec![],
            "tree1_sha".to_string(),
        );

        let commit2 = Commit::new(
            "commit2_sha".to_string(),
            "Second commit".to_string(),
            "Author2".to_string(),
            "author2@example.com".to_string(),
            files2,
            "test_repo".to_string(),
            vec!["commit1_sha".to_string()],
            "tree2_sha".to_string(),
        );

        let response = CommitListResponse {
            commits: vec![commit1, commit2],
            total: 2,
            repository_head: Some("commit2_sha".to_string()),
        };

        assert_eq!(response.commits.len(), 2);
        assert_eq!(response.total, 2);
        assert_eq!(response.repository_head, Some("commit2_sha".to_string()));
        assert_eq!(response.commits[0].message, "First commit");
        assert_eq!(response.commits[1].message, "Second commit");
    }

    #[test]
    fn test_realistic_git_sha_format() {
        let files = vec![
            CommitFile::new(
                "README.md".to_string(),
                "abc123def456".to_string(),
                1024,
                FileMode::File,
            ),
        ];

        let commit = Commit::new(
            "a1b2c3d4e5f6789012345678901234567890abcd".to_string(),  // 40-char hex SHA
            "Initial commit".to_string(),
            "John Doe".to_string(),
            "john@example.com".to_string(),
            files,
            "test_repo".to_string(),
            vec![],
            "1234567890abcdef1234567890abcdef12345678".to_string(),
        );

        // Verify SHA format is realistic (40 hex characters)
        assert_eq!(commit.id.len(), 40);
        assert!(commit.id.chars().all(|c| c.is_ascii_hexdigit()));
        
        // Verify tree SHA format
        assert_eq!(commit.tree_sha.len(), 40);
        assert!(commit.tree_sha.chars().all(|c| c.is_ascii_hexdigit()));
        
        // Verify commit has proper Git-like structure
        assert!(!commit.id.starts_with("temp_"));  // Should not be temporary
        assert!(commit.timestamp <= chrono::Utc::now());
    }

    #[test]
    fn test_commit_sha_uniqueness() {
        let files1 = vec![
            CommitFile::new(
                "file1.txt".to_string(),
                "hash1".to_string(),
                100,
                FileMode::File,
            ),
        ];

        let files2 = vec![
            CommitFile::new(
                "file2.txt".to_string(),
                "hash2".to_string(),
                200,
                FileMode::File,
            ),
        ];

        let commit1 = Commit::new(
            "a1b2c3d4e5f6789012345678901234567890abcd".to_string(),
            "First commit".to_string(),
            "Author".to_string(),
            "author@example.com".to_string(),
            files1,
            "test_repo".to_string(),
            vec![],
            "1234567890abcdef1234567890abcdef12345671".to_string(),
        );

        let commit2 = Commit::new(
            "b2c3d4e5f6789012345678901234567890abcdef".to_string(),
            "Second commit".to_string(),
            "Author".to_string(),
            "author@example.com".to_string(),
            files2,
            "test_repo".to_string(),
            vec![],
            "1234567890abcdef1234567890abcdef12345672".to_string(),
        );

        // Different commits should have different SHAs
        assert_ne!(commit1.id, commit2.id);
        assert_ne!(commit1.tree_sha, commit2.tree_sha);
        
        // Verify both are valid Git SHA format

        assert_eq!(commit1.id.len(), 40);
        assert_eq!(commit2.id.len(), 40);
        assert!(commit1.id.chars().all(|c| c.is_ascii_hexdigit()));
        assert!(commit2.id.chars().all(|c| c.is_ascii_hexdigit()));
    }
}