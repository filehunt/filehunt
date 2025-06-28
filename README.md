# 📁 Filehunt

A modern file management system with distributed processing capabilities and Git-backed versioning.

## Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+
- AWS CLI (optional)

### Development
```bash
# Start development environment
./scripts/start-dev-stack.sh

# Verify setup
./scripts/verify-setup.sh

# Run tests
./scripts/run-test.sh
```

### Production
```bash
# Start full stack
./scripts/start-full-stack.sh

# Monitor logs
./scripts/logs-full-stack.sh

# Stop stack
./scripts/stop-full-stack.sh
```

## Architecture

**Services:**
- **File Service** (`:3001`) - File uploads, storage, versioning
- **Git Service** (`:3002`) - Git-like version control
- **File Worker** - File processing (thumbnails, metadata, scanning)
- **Notification Worker** - User notifications
- **Message Queue** - SNS/SQS async processing

**Key Endpoints:**
- `POST /files/prepare` - Prepare file upload
- `POST /files/complete` - Complete upload
- `GET /files/:id` - Get file metadata
- `POST /commit` - Version control
- `GET /history/:fileId` - File history

## Documentation

📚 **[/docs](docs/)** - Complete documentation
- [Setup Guide](docs/SETUP.md)
- [Full Stack Deployment](docs/FULL-STACK.md)
- [Scripts Reference](docs/scripts.md)
- [Workers Guide](docs/WORKERS.md)
- [E2E Testing](docs/e2e.md)
- [Quick Start](docs/QUICK_START.md)

## Development Scripts

🔧 **[/scripts](scripts/)** - All automation scripts
- `start-dev-stack.sh` - Development environment
- `test-messaging.sh` - Test messaging system
- `test-file-service.sh` - Test file operations
- `setup-aws-messaging.sh` - Configure AWS services
- `build-file-service.sh` - Build services
- `start-workers.sh` - Start worker processes

## Project Structure

```
filehunt/
├── apps/
│   ├── file-service/               # Rust - File management
│   ├── git-service/                # Rust - Git backend
│   └── api-gateway/                # NestJS orchestrator
├── workers/
│   ├── file-worker/                # Rust - File processing
│   └── notification-worker/        # NestJS - Notifications
├── docs/                           # All documentation
├── scripts/                        # Automation scripts
└── e2e/                           # End-to-end tests
```

## Features

- 🔄 Git-based versioning (hidden from users)
- ⬆️ File upload with timeline navigation
- 💬 Comments & reviews per file/version
- 📤 Share files via links
- 🔍 Fast search across content & metadata
- ☁️ Cloud-native architecture (S3, PostgreSQL, SQS)

## Contributing

1. Fork repository
2. Create feature branch
3. Add tests
4. Submit pull request

## License

AGPL-3.0 - see LICENSE file for details
