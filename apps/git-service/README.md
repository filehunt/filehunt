# Git Service

A microservice for managing file versioning in a Git-like style for the FileHunt SaaS platform.

## Overview

The Git Service provides version control functionality for user files, storing commits and file versions in S3-compatible storage. It operates as a standalone microservice without database dependencies, using S3 for both file storage and metadata persistence.

## Features

- **Repository Management**: Create and manage user repositories
- **Commit Operations**: Create commits for uploaded files with metadata
- **Version History**: List and retrieve commit history
- **File Versioning**: Store and retrieve specific file versions
- **S3 Integration**: Uses S3-compatible storage (LocalStack for development)

## Architecture

- **Framework**: Axum (Rust async web framework)
- **Storage**: AWS S3 (LocalStack for local development)
- **No Database**: All metadata stored as JSON files in S3
- **File Organization**: Hierarchical structure in S3 buckets

### Storage Structure

```
repositories/
├── {user}_{repo_name}/
│   ├── repo_meta.json
│   └── commits/
│       └── {commit_id}/
│           ├── meta.json
│           └── file
```

## API Endpoints

### Health Checks
- `GET /health` - Service health status
- `GET /ready` - Readiness probe

### Repositories
- `POST /repositories` - Create a new repository
- `GET /repositories` - List all repositories
- `GET /repositories/{repository_id}` - Get repository details

### Commits
- `POST /repositories/{repository_id}/commits` - Create a new commit
- `GET /repositories/{repository_id}/commits` - List commits (paginated)
- `GET /repositories/{repository_id}/commits/{commit_id}` - Get commit details
- `GET /repositories/{repository_id}/commits/{commit_id}/details` - Get full commit details with metadata
- `GET /repositories/{repository_id}/commits/{commit_id}/file` - Download committed file

## Configuration

Environment variables:

- `SERVER_PORT` - Server port (default: 3000)
- `S3_BUCKET` - S3 bucket name (default: git-service-bucket)
- `S3_REGION` - AWS region (default: us-east-1)
- `S3_ENDPOINT` - S3 endpoint URL (for LocalStack: http://localhost:4566)
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `LOG_LEVEL` - Logging level (default: info)

## Development Setup

### Prerequisites

- Rust 1.70+
- LocalStack (for S3 emulation)
- Docker (for LocalStack)

### Local Development

1. **Start LocalStack**:
```bash
docker run --rm -it -p 4566:4566 -p 4510-4559:4510-4559 localstack/localstack
```

2. **Create S3 bucket**:
```bash
aws --endpoint-url=http://localhost:4566 s3 mb s3://git-service-bucket
```

3. **Set environment variables**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Run the service**:
```bash
cargo run
```

The service will be available at `http://localhost:3000`.

## Data Models

### Repository
```json
{
  "id": "user_repo",
  "name": "repo",
  "owner": "user",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "description": "Optional description",
  "latest_commit_id": "uuid"
}
```

### Commit
```json
{
  "id": "uuid",
  "message": "Commit message",
  "author": "user@example.com",
  "timestamp": "2024-01-01T00:00:00Z",
  "file_path": "/path/to/file",
  "file_hash": "sha256_hash",
  "repository_id": "user_repo",
  "parent_commit_id": "uuid"
}
```

## Integration Points

### File Service Integration
The service includes placeholder comments for file-service integration:
- `// TODO: call file-service here` - File content retrieval
- File validation and content fetching from file-service

### Future Enhancements
- Git CLI integration for advanced operations
- Diff generation between commits
- Branch and merge functionality
- Conflict resolution

## Testing

Run tests with:
```bash
cargo test
```

## Deployment

The service is designed to run as a containerized microservice:

1. Build the container
2. Set environment variables
3. Ensure S3 connectivity
4. Deploy with health check endpoints

## Monitoring

- Health endpoint: `/health`
- Readiness endpoint: `/ready`
- Structured logging with tracing
- Request/response logging middleware

## Security Considerations

- S3 credentials management
- Input validation for all endpoints
- File hash verification
- Repository access control (future)