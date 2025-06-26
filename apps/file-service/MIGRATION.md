# File Service Migration Guide

## Overview

This document outlines the major refactoring changes made to the file-service architecture to implement a more robust, scalable, and Git-like versioning system.

## Key Changes

### 1. Service Architecture Refactoring

#### Before
- Monolithic S3 service with all AWS logic in file-service
- Direct SQS messaging
- Single table for file metadata
- Tightly coupled services

#### After
- **Shared-rust package** for common AWS services (S3, SNS, SQS)
- **Specialized FileS3Service** extending shared functionality
- **SNS-based event publishing** with SQS consumption by workers
- **Separate tables** for file metadata and versions
- **Loosely coupled** microservice architecture

### 2. Database Schema Changes

#### New Tables Structure

**file_metadata** (Main file identity)
```sql
- id: UUID (Primary Key)
- user_id: UUID
- filename: VARCHAR(255)
- original_filename: VARCHAR(255)
- content_type: VARCHAR(255)
- tags: JSONB
- status: file_status (active, deleted, archived)
- current_version_id: UUID (FK to file_versions)
- total_versions: INTEGER
- total_size: BIGINT
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

**file_versions** (Git-like versioning)
```sql
- id: UUID (Primary Key)
- file_id: UUID (FK to file_metadata)
- version_number: INTEGER
- s3_key: VARCHAR(500)
- s3_bucket: VARCHAR(255)
- file_size: BIGINT
- file_hash: VARCHAR(255)
- commit_hash: VARCHAR(255)
- commit_message: TEXT
- created_by: UUID
- parent_version_id: UUID (FK to file_versions)
- status: version_status (uploading, processing, ready, failed, deleted)
- processing_metadata: JSONB
- created_at: TIMESTAMPTZ
```

### 3. Environment Variables Changes

#### Removed
```env
S3_BUCKET=filehunt-files
KMS_KEY_ID=alias/filehunt-file-encryption
FILE_PROCESSING_QUEUE_URL=...
NOTIFICATIONS_QUEUE_URL=...
```

#### Added
```env
# Multiple S3 buckets for separation of concerns
S3_FILE_BUCKET=filehunt-files
S3_GIT_BUCKET=filehunt-git
S3_SHARED_BUCKET=filehunt-shared
S3_PROCESSING_BUCKET=filehunt-processing
S3_KMS_KEY_ID=alias/filehunt-file-encryption

# SNS for event publishing
SNS_ENDPOINT=http://localhost:4566
SNS_TOPIC_ARN=arn:aws:sns:us-east-1:000000000000:filehunt-file-events
```

### 4. API Changes

#### New Endpoints
- `GET /files/:file_id/versions` - List file versions
- `POST /files/versions` - Create new file version
- `PUT /files/:file_id` - Update file metadata

#### Modified Request/Response Models

**PrepareUploadResponse**
```json
{
  "file_id": "uuid",
  "version_id": "uuid",          // NEW
  "presigned_url": "string",
  "s3_key": "string",
  "expires_at": "datetime"
}
```

**CompleteUploadRequest**
```json
{
  "file_id": "uuid",
  "version_id": "uuid",          // NEW
  "etag": "string",
  "actual_file_size": "number"   // NEW (optional)
}
```

**FileResponse**
```json
{
  "file_metadata": {
    "id": "uuid",
    "user_id": "uuid",
    "filename": "string",
    "original_filename": "string",
    "content_type": "string",
    "tags": "object",
    "status": "active|deleted|archived",
    "current_version_id": "uuid",  // NEW
    "total_versions": "number",    // NEW
    "total_size": "number",        // NEW
    "created_at": "datetime",
    "updated_at": "datetime"
  },
  "current_version": {             // NEW
    "id": "uuid",
    "version_number": "number",
    "file_size": "number",
    "file_hash": "string",
    "commit_hash": "string",
    "commit_message": "string",
    "created_by": "uuid",
    "status": "uploading|processing|ready|failed|deleted",
    "created_at": "datetime"
  },
  "download_url": "string"
}
```

### 5. Event-Driven Architecture

#### Before: Direct SQS Messages
- File processing queue
- Notifications queue
- Tightly coupled message formats

#### After: SNS Event Publishing
- **FileEvent** types: `file_uploaded`, `version_created`, `file_deleted`
- **ProcessingJob** events for async processing
- **NotificationEvent** for user notifications
- **Workers subscribe via SQS** with message filtering

#### Event Types
```rust
pub enum FileEventType {
    FileUploaded,
    FileVersionCreated,
    FileProcessingStarted,
    FileProcessingCompleted,
    FileProcessingFailed,
    FileDeleted,
    FileMetadataUpdated,
}
```

### 6. Service Dependencies

#### shared-rust Package
```toml
[dependencies]
serde = { version = "1", features = ["derive"] }
serde_json = "1.0"
aws-sdk-s3 = { version = "1.0", features = ["behavior-version-latest"] }
aws-sdk-sns = "1.0"
aws-sdk-sqs = "1.0"
aws-config = "1.0"
aws-credential-types = "1.0"
aws-types = "1.0"
uuid = { version = "1.10", features = ["v4", "serde"] }
chrono = { version = "0.4", features = ["serde"] }
```

#### file-service Dependencies
- **Removed**: Direct AWS SDK dependencies
- **Added**: `shared-rust` dependency
- **Maintained**: Database, cache, and HTTP dependencies

## Migration Steps

### 1. Database Migration
```sql
-- Run the new init-db.sql script
-- Migrate existing data if needed:
-- 1. Create file_versions from existing file_metadata
-- 2. Update file_metadata structure
-- 3. Set current_version_id references
```

### 2. Environment Variables
```bash
# Update all environment files with new variable names
# Remove old SQS queue URLs
# Add new SNS topic ARN and multiple S3 bucket names
```

### 3. Docker Compose
```yaml
# Update localstack services to include SNS
# Create new S3 buckets and SNS topics
# Update environment variables for all services
```

### 4. Application Code
- **Services**: Use shared-rust components
- **Models**: Update to new data structures
- **Handlers**: Support versioning and new API endpoints
- **Events**: Publish to SNS instead of direct SQS

## Benefits of Refactoring

### 1. Scalability
- **Microservice architecture** with shared components
- **Event-driven processing** decouples services
- **Multiple S3 buckets** for better organization

### 2. Maintainability
- **Shared code** reduces duplication
- **Git-like versioning** provides familiar mental model
- **Clear separation** of concerns between files and versions

### 3. Features
- **File versioning** with parent-child relationships
- **Commit messages** for change tracking
- **Flexible processing** pipeline via events
- **Better metadata** management

### 4. Performance
- **Cached metadata** at multiple levels
- **Optimized queries** with proper indexing
- **Async processing** for heavy operations

## Breaking Changes

### API Clients
- Update to new response formats
- Handle version_id in upload flow
- Use new version endpoints

### Workers
- Subscribe to SNS topics instead of SQS queues
- Handle new event message formats
- Process versioned files

### Database Applications
- Update queries for new table structure
- Handle version relationships
- Use new status enums

## Testing

### Postman Collection
- Complete test suite in `e2e/file-service.postman_collection.json`
- Covers all new endpoints and scenarios
- Includes error case testing

### Development Scripts
- `scripts/start-dev-stack.sh` - Full environment
- `scripts/test-file-service.sh` - API testing
- `scripts/dev-file-service.sh` - Service only

## Rollback Plan

### If Issues Arise
1. **Database**: Keep old schema until migration is verified
2. **Environment**: Maintain backward compatibility during transition
3. **Services**: Deploy with feature flags to enable/disable new features
4. **Events**: Dual-publish to both old and new systems during migration

## Future Enhancements

### Planned Features
- **File deduplication** based on content hash
- **Branch-like versioning** for parallel development
- **Diff generation** between versions
- **Automated rollback** to previous versions
- **Version merging** capabilities

### Architecture Evolution
- **gRPC communication** between services
- **Event sourcing** for complete audit trails
- **CQRS pattern** for read/write optimization
- **Multi-region replication** for global availability