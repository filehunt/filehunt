# File Service - Architecture Documentation

## Overview

The **file-service** is a Rust-based microservice responsible for handling file uploads, metadata management, and integration with other services in the Filehunt ecosystem. It provides a secure, scalable, and efficient file management system with AWS integration.

## Architecture Diagram

```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐
│   Client    │───▶│ File Service │───▶│     S3      │
│             │    │   (Axum)     │    │  (Files)    │
└─────────────┘    └──────────────┘    └─────────────┘
                           │
                           ▼
                   ┌──────────────┐    ┌─────────────┐
                   │ PostgreSQL   │    │    Redis    │
                   │ (Metadata)   │    │   (Cache)   │
                   └──────────────┘    └─────────────┘
                           │
                           ▼
                   ┌──────────────┐    ┌─────────────┐
                   │ Git Service  │    │     SQS     │
                   │ (Versioning) │    │  (Events)   │
                   └──────────────┘    └─────────────┘
```

## Core Components

### 1. Web Framework (Axum)
- **Role**: HTTP server and request handling
- **Features**: 
  - Async request processing
  - JSON serialization/deserialization
  - CORS support
  - Middleware for logging and error handling
  - Route parameter extraction

### 2. AWS Services Integration

#### S3 Service
- **Purpose**: Secure file storage with encryption
- **Features**:
  - Presigned URL generation for direct client uploads
  - KMS encryption for all stored files
  - File existence verification
  - Download URL generation
  - Bucket encryption management

#### SQS Service
- **Purpose**: Asynchronous event publishing
- **Queues**:
  - `file-processing-queue.fifo`: File processing events
  - `notifications-queue.fifo`: User notification events
- **Message Types**:
  - Upload completion notifications
  - Processing triggers
  - Error notifications

#### KMS Service
- **Purpose**: File encryption key management
- **Features**:
  - Automatic encryption for S3 objects
  - Key rotation support
  - Secure key access via IAM

### 3. Database Layer

#### PostgreSQL (Primary Storage)
- **Schema**:
  ```sql
  CREATE TABLE file_metadata (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    s3_key VARCHAR(500) NOT NULL,
    s3_bucket VARCHAR(255) NOT NULL,
    git_commit_hash VARCHAR(255),
    file_hash VARCHAR(255) NOT NULL,
    tags JSONB,
    status file_status NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
  );
  ```

#### Redis (Cache Layer)
- **Cache Strategies**:
  - File metadata caching (1 hour TTL)
  - User file lists (30 minutes TTL)
  - File statistics (5 minutes TTL)
  - Presigned URLs (match S3 expiry)

### 4. External Service Integration

#### Git Service
- **Purpose**: Version control for uploaded files
- **Operations**:
  - Create repositories for users
  - Commit file references
  - Retrieve commit information
  - Health monitoring

## Data Flow

### File Upload Process

```
1. Client Request → POST /files/prepare
   ├─ Validate file size/type
   ├─ Generate unique file ID
   ├─ Create S3 presigned URL
   ├─ Store initial metadata (status: uploading)
   └─ Return presigned URL to client

2. Client Upload → Direct to S3
   ├─ Client uploads file using presigned URL
   └─ S3 stores file with KMS encryption

3. Upload Completion → POST /files/complete
   ├─ Verify file exists in S3
   ├─ Generate file hash from S3 ETag
   ├─ Create Git commit via git-service
   ├─ Update metadata (status: processing → ready)
   ├─ Send SQS messages for processing/notifications
   └─ Update cache and return response
```

### File Retrieval Process

```
1. Client Request → GET /files/:id
   ├─ Check Redis cache for metadata
   ├─ Fallback to PostgreSQL if cache miss
   ├─ Generate presigned download URL (if ready)
   └─ Return metadata + download URL
```

### File Listing Process

```
1. Client Request → GET /files?filters
   ├─ Check Redis cache for user file list
   ├─ Query PostgreSQL with pagination/filters
   ├─ Cache results for future requests
   └─ Return paginated file list
```

## Security Model

### Authentication & Authorization
- JWT token validation (future implementation)
- User-based file access control
- IAM roles for AWS service access

### Data Protection
- KMS encryption for all S3 objects
- Presigned URLs with short expiration (1 hour)
- File type validation
- File size limits (configurable)
- SQL injection prevention via parameterized queries

### Network Security
- CORS configuration for cross-origin requests
- HTTPS enforcement in production
- VPC isolation for AWS resources

## Configuration Management

### Environment Variables
```env
# Server
SERVER_PORT=3001

# Database
DATABASE_URL=postgresql://...
REDIS_URL=redis://...

# AWS
AWS_REGION=us-east-1
S3_BUCKET=filehunt-files
KMS_KEY_ID=alias/filehunt-encryption
SQS_ENDPOINT=http://localhost:4566

# External Services
GIT_SERVICE_URL=http://localhost:3000

# Limits
MAX_FILE_SIZE=104857600  # 100MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,...
```

## Error Handling

### Error Types
- **Validation Errors**: File size/type validation failures
- **Storage Errors**: S3 operation failures
- **Database Errors**: PostgreSQL connection/query failures
- **Cache Errors**: Redis operation failures (non-blocking)
- **External Service Errors**: Git service communication failures

### Error Response Format
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "File size exceeds maximum allowed",
    "details": {
      "max_size": 104857600,
      "provided_size": 200000000
    }
  }
}
```

## Performance Considerations

### Optimizations
- Connection pooling for PostgreSQL
- Redis caching for frequently accessed data
- Async processing for non-blocking operations
- Direct S3 uploads (bypass service for file data)
- Pagination for large result sets

### Monitoring Metrics
- Request latency and throughput
- Database connection pool usage
- Cache hit/miss ratios
- S3 operation success rates
- SQS message processing times

## Scalability Design

### Horizontal Scaling
- Stateless service design
- Database connection pooling
- Redis cluster support
- Load balancer compatibility

### Vertical Scaling
- Configurable worker thread pools
- Memory-efficient data structures
- Streaming for large file operations

## Testing Strategy

### Unit Tests
- Service layer logic testing
- Database query validation
- Error handling verification

### Integration Tests
- AWS service integration
- Database operations
- Cache behavior validation

### End-to-End Tests
- Complete upload/download workflows
- Error scenario handling
- Performance benchmarking

## Deployment

### Container Configuration
```dockerfile
FROM rust:1.75-slim as builder
# Build dependencies and application
FROM debian:bookworm-slim
# Runtime environment with minimal dependencies
```

### Health Checks
- `/health`: Basic service availability
- `/ready`: Dependency health verification
- `/live`: Kubernetes liveness probe

### Resource Requirements
- **CPU**: 1-2 cores for typical workloads
- **Memory**: 512MB-1GB base + connection pools
- **Storage**: Minimal (logs only, files in S3)
- **Network**: High bandwidth for presigned URL generation

## Future Enhancements

### Planned Features
- File deduplication based on content hash
- Multi-part upload support for large files
- File compression optimization
- Advanced caching strategies
- Metrics and observability improvements

### Technical Debt
- Add comprehensive error tracking
- Implement request tracing
- Add performance profiling
- Enhance test coverage
- Add API documentation generation