# 🔧 Scripts Reference

Automation scripts for development, testing, and deployment of Filehunt.

## 📂 Script Categories

### 🚀 Development
- **`start-dev-stack.sh`** - Start development environment
- **`stop-dev-stack.sh`** - Stop development environment
- **`verify-setup.sh`** - Verify environment setup
- **`start-workers.sh`** - Start worker processes

### 🧪 Testing
- **`run-test.sh`** - Run comprehensive test suite
- **`test-file-service.sh`** - Test file operations
- **`test-messaging.sh`** - Test SNS/SQS messaging

### 🏗️ Building
- **`build-file-service.sh`** - Build Rust services

### ⚙️ Infrastructure
- **`setup-aws-messaging.sh`** - Configure AWS messaging
- **`logs-full-stack.sh`** - View production logs
- **`start-full-stack.sh`** - Start production stack
- **`stop-full-stack.sh`** - Stop production stack

## 📖 Script Documentation

### Development Environment

#### `start-dev-stack.sh`
```bash
./scripts/start-dev-stack.sh
```
**Purpose:** Complete development environment setup

**Actions:**
- Starts PostgreSQL, Redis, LocalStack
- Creates S3 buckets, SNS/SQS resources
- Initializes database schema
- Verifies all services

**Ports:** 3000-3002, 4566, 5432, 6379

#### `verify-setup.sh`
```bash
./scripts/verify-setup.sh
```
**Checks:**
- Docker containers running
- Database connectivity
- AWS resources exist
- Service health endpoints

### Testing

#### `run-test.sh`
```bash
./scripts/run-test.sh
```
**Test Coverage:**
- API endpoint tests
- File upload/download
- Message queue flow
- Integration scenarios
- Error handling

#### `test-messaging.sh`
```bash
./scripts/test-messaging.sh
```
**Tests:**
- SNS event publishing
- SQS message delivery
- Worker message processing
- Queue filtering and routing

### Production

#### `start-full-stack.sh`
```bash
./scripts/start-full-stack.sh
```
**Production deployment with:**
- Optimized builds
- Health monitoring
- Log aggregation
- Resource limits

#### `setup-aws-messaging.sh`
```bash
# LocalStack (development)
./scripts/setup-aws-messaging.sh --localstack

# Real AWS (production)
./scripts/setup-aws-messaging.sh --production
```
**Creates:**
- SNS topics and subscriptions
- SQS queues and DLQs
- IAM roles and policies
- Resource tagging

## ⚙️ Environment Configuration

### Required Files
```
apps/file-service/.env
apps/git-service/.env
workers/file-worker/.env
workers/notification-worker/.env
```

### Example Configuration
```bash
# Copy examples
cp apps/file-service/.env.example apps/file-service/.env
cp workers/file-worker/.env.example workers/file-worker/.env

# Edit as needed
vim apps/file-service/.env
```

## 🔧 Common Workflows

### First Time Setup
```bash
# 1. Start environment
./scripts/start-dev-stack.sh

# 2. Verify everything works
./scripts/verify-setup.sh

# 3. Run tests
./scripts/run-test.sh
```

### Development Cycle
```bash
# Start workers
./scripts/start-workers.sh

# Test changes
./scripts/test-file-service.sh

# Test messaging
./scripts/test-messaging.sh
```

### Production Deployment
```bash
# Build services
./scripts/build-file-service.sh --release

# Deploy stack
./scripts/start-full-stack.sh

# Monitor
./scripts/logs-full-stack.sh
```

## 🐛 Troubleshooting

### Port Conflicts
```bash
# Check ports
lsof -i :3001 -i :4566

# Stop conflicting services
docker stop $(docker ps -q)
```

### Docker Issues
```bash
# Clean Docker
docker system prune -a
docker volume prune

# Restart environment
./scripts/stop-dev-stack.sh
./scripts/start-dev-stack.sh
```

### Database Problems
```bash
# Check logs
docker logs filehunt-postgres

# Reset database
docker-compose down -v
./scripts/start-dev-stack.sh
```

### AWS/LocalStack Issues
```bash
# Restart LocalStack
docker-compose restart localstack

# Recreate resources
./scripts/setup-aws-messaging.sh --localstack
```

## 📋 Service Ports

| Service | Port | Purpose |
|---------|------|----------|
| File Service | 3001 | File operations |
| Git Service | 3002 | Version control |
| API Gateway | 3000 | Main API |
| PostgreSQL | 5432 | Database |
| Redis | 6379 | Cache |
| LocalStack | 4566 | AWS emulation |

## 🏗️ AWS Resources

### S3 Buckets
- `filehunt-files` - User files
- `filehunt-git` - Git repositories
- `filehunt-shared` - Shared files
- `filehunt-processing` - Temp processing

### Messaging
- **SNS Topic:** `filehunt-file-events`
- **SQS Queues:** `file-processing-queue`, `notification-queue`
- **Dead Letter Queues:** `*-dlq`

## 🔄 Adding New Scripts

1. **Create script** in `/scripts`
2. **Make executable:** `chmod +x script.sh`
3. **Add documentation** here
4. **Include error handling**
5. **Test thoroughly**

### Script Template
```bash
#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
echo_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
echo_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Script logic here
```
