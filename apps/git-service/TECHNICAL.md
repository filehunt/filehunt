# Git Service - Technical Documentation

## Architecture Overview

The Git Service is a microservice built in Rust using the Axum web framework. It provides Git-like versioning functionality for user files in the FileHunt SaaS platform.

### Key Design Decisions

- **No Database**: All metadata stored as JSON files in S3 for simplicity and scalability
- **S3-First**: Uses S3 as both file storage and metadata store
- **Stateless**: Each request is independent, enabling horizontal scaling
- **Async-First**: Built on Tokio for high concurrency

## Code Structure

```
src/
├── main.rs              # Application entry point, routing, middleware
├── config/
│   └── mod.rs           # Configuration management
├── models/
│   ├── mod.rs           # Model exports
│   ├── commit.rs        # Commit data structures
│   ├── repository.rs    # Repository data structures
│   └── error.rs         # Error types and handling
├── services/
│   ├── mod.rs           # Service layer exports
│   ├── s3_service.rs    # S3 operations abstraction
│   └── git_service.rs   # Core business logic
├── handlers/
│   ├── mod.rs           # Handler exports
│   ├── repository_handlers.rs  # Repository HTTP endpoints
│   ├── commit_handlers.rs      # Commit HTTP endpoints
│   └── health_handlers.rs      # Health check endpoints
└── state/
    └── mod.rs           # Application state management
```

## Data Models

### Repository
- **Primary Key**: `{owner}_{name}` format
- **Storage**: `repositories/{repo_id}/repo_meta.json`
- **Fields**: id, name, owner, timestamps, description, latest_commit_id

### Commit  
- **Primary Key**: UUID v4
- **Storage**: `repositories/{repo_id}/commits/{commit_id}/meta.json`
- **File Storage**: `repositories/{repo_id}/commits/{commit_id}/file`
- **Fields**: id, message, author, timestamp, file_path, file_hash, repository_id, parent_commit_id

### Storage Hierarchy
```
S3 Bucket Structure:
repositories/
├── {owner}_{repo_name}/
│   ├── repo_meta.json           # Repository metadata
│   └── commits/
│       ├── {commit_id_1}/
│       │   ├── meta.json        # Commit metadata
│       │   └── file             # Actual file content
│       └── {commit_id_2}/
│           ├── meta.json
│           └── file
```

## Service Layer Architecture

### S3Service
- **Responsibility**: Low-level S3 operations
- **Methods**: put_object, get_object, list_objects, object_exists
- **Features**: File hashing, error handling, object management

### GitService  
- **Responsibility**: Business logic orchestration
- **Operations**: Repository CRUD, Commit management, History tracking
- **Integration Points**: File-service calls (TODO markers)

## API Design

### RESTful Endpoints
- `POST /repositories` - Create repository
- `GET /repositories/{id}` - Get repository with stats
- `POST /repositories/{id}/commits` - Create commit
- `GET /repositories/{id}/commits` - List commits (paginated)
- `GET /repositories/{id}/commits/{commit_id}` - Get commit details

### Error Handling
- **Structured Errors**: Custom error types with HTTP status mapping
- **Error Responses**: JSON format with error code, message, status
- **Error Propagation**: Using `?` operator with custom Result type

## Concurrency & Performance

### Async Operations
- **Tokio Runtime**: All I/O operations are async
- **S3 SDK**: Official AWS SDK with async support  
- **Request Handling**: Concurrent request processing via Axum

### Performance Considerations
- **Pagination**: Built-in for commit listing
- **Lazy Loading**: Metadata loaded on-demand
- **Connection Pooling**: AWS SDK handles connection pooling

## Configuration Management

### Environment Variables
```
SERVER_PORT=3000
S3_BUCKET=git-service-bucket
S3_REGION=us-east-1
S3_ENDPOINT=http://localhost:4566  # LocalStack
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
LOG_LEVEL=info
```

### Config Loading
- **dotenv**: Development environment support
- **Defaults**: Sensible defaults for all optional configs
- **Validation**: Config validation at startup

## Integration Points

### File Service Integration
- **Location**: `git_service.rs:get_file_content_from_file_service()`
- **Purpose**: Retrieve actual file content for commits
- **Current State**: TODO placeholder with mock implementation
- **Future**: HTTP client calls to file-service endpoints

### Service Discovery
- **Current**: Direct endpoint configuration
- **Future**: Service mesh or service discovery integration

## Development Workflow

### Local Development
1. **LocalStack**: S3 emulation via Docker
2. **Environment**: `.env` file configuration
3. **Testing**: Unit tests + integration test script
4. **Debugging**: Structured logging with tracing

### Build & Deployment
- **Cargo**: Standard Rust build system
- **Docker**: Containerization ready (no Dockerfile yet)
- **Health Checks**: `/health` and `/ready` endpoints

## Error Handling Strategy

### Error Types
- **Repository Errors**: Not found, already exists
- **Commit Errors**: Not found, invalid data
- **S3 Errors**: Connection, permission, storage issues
- **Serialization Errors**: JSON parsing failures

### Error Recovery
- **Graceful Degradation**: Service continues on non-critical errors
- **Retry Logic**: AWS SDK handles retries automatically
- **Circuit Breaker**: Future consideration for external service calls

## Security Considerations

### Current Implementation
- **Input Validation**: Basic validation on API inputs
- **S3 Security**: IAM-based access control
- **No Authentication**: Service-to-service trust model

### Future Security Enhancements
- **Request Authentication**: JWT or API key validation
- **Authorization**: Repository-level access control
- **Audit Logging**: Enhanced security event logging
- **Rate Limiting**: Per-user or per-IP rate limits

## Monitoring & Observability

### Logging
- **Structured Logging**: JSON format via tracing
- **Log Levels**: Configurable via LOG_LEVEL
- **Request Tracing**: HTTP request/response logging

### Metrics (Future)
- **Prometheus**: Metrics collection
- **Custom Metrics**: Repository count, commit frequency, storage usage
- **Health Metrics**: S3 connectivity, response times

## Scalability Design

### Horizontal Scaling
- **Stateless Design**: No local state, scales horizontally
- **Load Balancing**: Standard HTTP load balancer compatible
- **Database-Free**: No database bottlenecks

### Storage Scaling
- **S3 Scalability**: Virtually unlimited storage
- **Partitioning**: Natural partitioning by repository
- **Caching**: Future Redis integration for metadata caching

## Testing Strategy

### Unit Tests
- **Model Tests**: Data structure validation
- **Service Tests**: Business logic verification
- **Error Tests**: Error handling paths

### Integration Tests
- **API Tests**: End-to-end endpoint testing
- **S3 Tests**: Storage operation validation
- **Health Tests**: Service availability checks

## Future Enhancements

### Git Features
- **Branching**: Multiple development lines
- **Merging**: Combine different branches
- **Diff Generation**: File change visualization
- **Conflict Resolution**: Merge conflict handling

### Performance Optimizations
- **Caching Layer**: Redis for frequently accessed data
- **CDN Integration**: File content delivery optimization
- **Compression**: File content compression in storage

### Operational Features
- **Backup Strategy**: Cross-region replication
- **Disaster Recovery**: Service restoration procedures
- **Capacity Planning**: Storage and compute scaling strategies