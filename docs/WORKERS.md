# 🔄 Filehunt Workers

Two workers that process file upload events via SNS → SQS architecture.

## 🏗️ Architecture

```
File Upload Event → SNS Topic → ┌── notifications-queue → notification-worker (NestJS)
                                │
                                └── file-processing-queue → file-worker (Rust)
```

## 🚀 Quick Start

### 1. Prerequisites
```bash
# Start LocalStack
docker-compose up localstack

# Setup SNS/SQS infrastructure
./scripts/setup-infrastructure.sh
```

### 2. Start Workers
```bash
# Start both workers
./workers/start-all.sh

# Or individually:
./workers/notification-worker/start.sh
./workers/file-worker/start.sh
```

### 3. Test
```bash
cd workers
npm install
npm run test:event        # Single event
npm run test:multiple     # Multiple file types
```

## 📋 Workers

### notification-worker (NestJS)
- **Queue**: `notifications-queue`
- **Purpose**: Send notifications when files are uploaded
- **Output**: `"Sending notification to user {user_id}: Your file {file_name} is ready"`

### file-worker (Rust)
- **Queue**: `file-processing-queue`
- **Purpose**: Post-process files based on content type
- **Processing**:
  - `image/*` → "Generating thumbnail..."
  - `video/*` → "Processing video..."
  - `application/pdf` → "Extracting text..."
  - Others → "Basic processing..."

## 🔧 Configuration

Both workers use LocalStack environment:
```bash
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_DEFAULT_REGION=us-east-1
SQS_ENDPOINT=http://localhost:4566
```

## ✅ Success Criteria

- Both workers receive the same `file_uploaded` event
- Messages are processed and deleted from queues
- Appropriate logs are generated based on file type
- Graceful error handling with retries

See `workers/README.md` for detailed documentation.