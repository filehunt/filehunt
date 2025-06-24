use sha1::{Digest, Sha1};
use hex;
use regex::Regex;

#[test]
fn test_git_sha_format() {
    let sha_regex = Regex::new(r"^[a-f0-9]{40}$").unwrap();
    
    // Test SHA generation
    let test_sha = generate_commit_sha("Test commit", "author", "email@test.com");
    
    assert!(sha_regex.is_match(&test_sha));
    assert_eq!(test_sha.len(), 40);
    assert!(test_sha.chars().all(|c| c.is_ascii_hexdigit()));
}

#[test]
fn test_sha_uniqueness() {
    let sha1 = generate_commit_sha("First commit", "author", "email");
    let sha2 = generate_commit_sha("Second commit", "author", "email");
    let sha3 = generate_commit_sha("First commit", "different author", "email");
    
    assert_ne!(sha1, sha2);
    assert_ne!(sha1, sha3);
    assert_ne!(sha2, sha3);
    
    // All should be valid 40-char hex
    assert_eq!(sha1.len(), 40);
    assert_eq!(sha2.len(), 40);
    assert_eq!(sha3.len(), 40);
}

#[test]
fn test_no_temporary_shas() {
    let sha = generate_commit_sha("Test commit", "author", "email");
    
    // Should not start with "temp_" like the old implementation
    assert!(!sha.starts_with("temp_"));
    assert!(!sha.contains("temp"));
}

fn generate_commit_sha(message: &str, author: &str, email: &str) -> String {
    let mut hasher = Sha1::new();
    
    hasher.update(format!("commit {}\0", message.len() + author.len() + email.len()));
    hasher.update(format!("tree {}\n", "example_tree_sha"));
    hasher.update(format!("author {} <{}> {}\n", author, email, chrono::Utc::now().timestamp()));
    hasher.update(format!("committer {} <{}> {}\n", author, email, chrono::Utc::now().timestamp()));
    hasher.update("\n");
    hasher.update(message);
    
    hex::encode(hasher.finalize())
}