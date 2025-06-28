# File Service

File management and Git versioning service for the Filehunt SaaS architecture.

## Features

- **Secure Upload**: S3 pre-signed URL generation with KMS encryption
- **Git Versioning**: Integration with git-service for file versioning
- **Metadata**: PostgreSQL storage with Redis cache
- **Asynchronous Processing**: SQS messages for background processing
- **Notifications**: Notification system via SQS

## Architecture

```
Client -> File Service -> S3 (upload)
                      -> Git Service (commit)
                      -> PostgreSQL (metadata)
                      -> Redis (cache)
                      -> SQS (processing/notifications)
```

## API Endpoints

### Health Checks
- `GET /health` - Health check
- `GET /ready` - Readiness check
- `GET /live` - Liveness check

### File Operations
- `POST /files/prepare` - Prepare an upload
- `POST /files/complete` - Complete an upload
- `GET /files/:file_id` - Retrieve a file
- `DELETE /files/:file_id` - Delete a file
- `GET /files` - List files

### Statistics
- `GET /stats` - File statistics

## Configuration

See `.env.example` for complete configuration.

### Main Variables

```env
SERVER_PORT=3001
DATABASE_URL=postgresql://user:pass@host:5432/db
REDIS_URL=redis://localhost:6379
S3_BUCKET=filehunt-files
GIT_SERVICE_URL=http://localhost:3000
```

## Development

### Prerequisites
- Rust 1.75+
- PostgreSQL 16+
- Redis 7+
- LocalStack (for AWS services)

### Installation

1. Copy configuration:
```bash
cp .env.example .env
```

2. Start services:
```bash
docker-compose up postgres redis localstack aws-setup
```

3. Run the service:
```bash
cargo run
```

### Tests

```bash
cargo test
```

## Deployment

### Docker

```bash
docker-compose up file-service
```

### Production

1. Configure real AWS environment variables
2. Use managed PostgreSQL database
3. Use managed Redis
4. Configure proper service URLs

## Data Flow

### File Upload

1. **Preparation**: `POST /files/prepare`
   - File validation
   - S3 pre-signed URL generation
   - Metadata creation (status: uploading)

2. **Upload**: Client -> S3 directly

3. **Completion**: `POST /files/complete`
   - S3 file verification
   - Git-service commit
   - Metadata update (status: ready)
   - SQS messages (processing + notification)

### Asynchronous Processing

- **file-processing-queue**: File processing (preview, transcoding)
- **notifications-queue**: User notifications

## Services Used

- **S3**: File storage with KMS encryption
- **SQS**: Processing and notification queues (FIFO)
- **KMS**: File encryption
- **PostgreSQL**: File metadata
- **Redis**: Metadata cache and pre-signed URLs

## Security

- KMS encryption for all S3 files
- File type validation
- File size limitations
- Pre-signed URLs with expiration
- User isolation

## Monitoring

- Health checks for all services
- Structured logs with tracing
- Performance metrics
- Cache for performance optimization
