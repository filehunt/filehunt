# Filehunt Setup

## Docker Compose

The project now uses a centralized `docker-compose.yml` at the project root that manages the common infrastructure for all services.

### Available Services

- **LocalStack**: Emulates AWS services (S3) locally
- **S3 Setup**: Automatically configures necessary S3 buckets

### Getting Started

```bash
# Start infrastructure
docker-compose up -d

# Verify services are ready
docker-compose ps
```

### Automatically Created S3 Buckets

- `filehunt-git-service`: For the Git service
- `filehunt-shared`: For shared data

## S3 Architecture

### Shared-Rust Library

S3 logic has been moved to `packages/shared-rust` as a shared library:

- `src/s3/service.rs`: S3 service with all operations
- `src/s3/config.rs`: Flexible S3 configuration
- `src/s3/mod.rs`: Module exports

### Per-Service Configuration

Each service configures its own S3 client via environment variables:

```rust
// In git-service
let s3_config = shared_rust::s3::S3Config::from_env("git-service");
let s3_service = shared_rust::s3::S3Service::from_config(&s3_config).await?;
```

### Environment Variables

- `{SERVICE}_S3_BUCKET`: Bucket name (e.g., `GIT_SERVICE_S3_BUCKET`)
- `S3_REGION`: S3 region (default: `us-east-1`)
- `S3_ENDPOINT`: S3 endpoint (for LocalStack: `http://localhost:4566`)
- `AWS_ACCESS_KEY_ID`: Access key (default: `test` for LocalStack)
- `AWS_SECRET_ACCESS_KEY`: Secret key (default: `test` for LocalStack)

## Architecture Benefits

1. **Centralization**: Single docker-compose for all infrastructure
2. **Reusability**: S3 logic is shared across all services
3. **Flexibility**: Each service can have its own S3 configuration
4. **Scalability**: Easy to add new services with S3

## Development

### Adding a New Service with S3

1. Add `shared-rust` as a dependency in `Cargo.toml`
2. Configure S3 with `S3Config::from_env("my-service")`
3. Add the bucket in `docker-compose.yml` if necessary

### Local Testing

```bash
# Start LocalStack
docker-compose up -d localstack

# Verify S3 connectivity
aws --endpoint-url=http://localhost:4566 s3 ls
```
