# 📚 Filehunt Documentation

Welcome to the Filehunt documentation. This directory contains all the comprehensive guides and references.

## 📖 Documentation Index

### Getting Started
- **[SETUP.md](SETUP.md)** - Installation and configuration guide
- **[QUICK_START.md](QUICK_START.md)** - Quick start tutorial

### Deployment
- **[FULL-STACK.md](FULL-STACK.md)** - Production deployment guide

### Development
- **[scripts.md](scripts.md)** - Available scripts and automation tools
- **[WORKERS.md](WORKERS.md)** - Worker services documentation

### Testing
- **[e2e.md](e2e.md)** - End-to-end testing guide

## 🏗️ Architecture Overview

Filehunt is built as a distributed system with these key components:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   File Service  │    │   Git Service   │    │  API Gateway    │
│   (Rust :3001)  │    │   (Rust :3002)  │    │ (NestJS :3000)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
         ┌─────────────────────────────────────────────────┐
         │              Message Queue (SNS/SQS)           │
         └─────────────────────────────────────────────────┘
                                 │
         ┌─────────────────┐              ┌─────────────────┐
         │   File Worker   │              │ Notification    │
         │   (Rust)        │              │ Worker (NestJS) │
         └─────────────────┘              └─────────────────┘
```

## 🔧 Quick Commands

```bash
# Development
./scripts/start-dev-stack.sh       # Start dev environment
./scripts/verify-setup.sh          # Verify installation
./scripts/test-messaging.sh        # Test messaging system

# Production
./scripts/start-full-stack.sh      # Start production stack
./scripts/logs-full-stack.sh       # View logs
./scripts/stop-full-stack.sh       # Stop stack

# Testing
./scripts/run-test.sh              # Run all tests
./scripts/test-file-service.sh     # Test file operations
```

## 📝 Document Structure

Each documentation file follows this structure:
- **Purpose** - What this covers
- **Prerequisites** - What you need first
- **Step-by-step guides** - How to do it
- **Troubleshooting** - Common issues
- **References** - Links to related docs

## 🔗 External Resources

- [Rust Documentation](https://doc.rust-lang.org/)
- [NestJS Documentation](https://nestjs.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [AWS Services Documentation](https://docs.aws.amazon.com/)

## 📞 Need Help?

1. Check the relevant documentation file
2. Look for troubleshooting sections
3. Review the script source code in `/scripts`
4. Create an issue in the repository
