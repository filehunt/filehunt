# Filehunt Full Stack Deployment

This guide explains how to deploy and manage the complete Filehunt stack with all services and workers in Docker containers.

## Overview

The complete stack includes:

### Core Services
- **File Service** (Rust) - File and metadata management
- **Git Service** (Rust) - Git repository management
- **PostgreSQL** - Main database
- **Redis** - Cache and sessions
- **LocalStack** - AWS services simulation

### Workers
- **File Worker** (Rust) - File processing
- **File Indexer** (Rust) - File indexing in the database
- **Notification Worker** (Node.js/NestJS) - Notification management

## Prerequisites

- Docker and Docker Compose installed
- At least 4 GB of available RAM
- Ports 3000, 3001, 4566, 5432, 6379 available

## Quick Start

### 1. Launch the Complete Stack

```bash
./start-full-stack.sh
```

This script will:
- Create necessary directories
- Stop existing containers
- Build and launch all services
- Display service status

### 2. Verify Everything Works

```bash
# Check container status
docker-compose -f docker-compose-full.yml ps

# Test services
curl http://localhost:3001/health  # File Service
curl http://localhost:3000/health  # Git Service
```

### 3. View Logs

```bash
# View all logs
./logs-full-stack.sh all

# Follow logs for a specific service
./logs-full-stack.sh file-service --follow

# Follow all logs in real-time
./logs-full-stack.sh all --follow
```

### 4. Stop the Stack

```bash
./stop-full-stack.sh
```

## Available Services

Once the stack is launched, services are accessible at the following addresses:

| Service | URL | Description |
|---------|-----|-------------|
| File Service | http://localhost:3001 | File management API |
| Git Service | http://localhost:3000 | Git management API |
| PostgreSQL | localhost:5432 | Database (user: filehunt, password: filehunt_password) |
| Redis | localhost:6379 | Redis cache |
| LocalStack | http://localhost:4566 | Simulated AWS services |

## Workers

Workers run in the background and process messages from SQS queues:

- **File Worker**: Processes uploaded files
- **File Indexer**: Indexes files in the database
- **Notification Worker**: Sends notifications

## Log Management

### View Logs by Service

```bash
# File service logs
./logs-full-stack.sh file-service

# File worker logs
./logs-full-stack.sh file-worker

# All services logs
./logs-full-stack.sh all
```

### Follow Logs in Real-time

```bash
# Follow a specific service
./logs-full-stack.sh file-service --follow

# Follow all logs
./logs-full-stack.sh all --follow
```

## Useful Docker Compose Commands

```bash
# Check service status
docker-compose -f docker-compose-full.yml ps

# Restart a specific service
docker-compose -f docker-compose-full.yml restart file-service

# Rebuild and restart a service
docker-compose -f docker-compose-full.yml up --build -d file-service

# View service logs
docker-compose -f docker-compose-full.yml logs file-service

# Execute a command in a container
docker-compose -f docker-compose-full.yml exec file-service sh

# Stop and remove all containers
docker-compose -f docker-compose-full.yml down

# Stop and remove with volumes
docker-compose -f docker-compose-full.yml down --volumes
```

## Development and Testing

### Integration Tests

The complete stack is ideal for integration testing as all services communicate with each other via SQS/SNS queues simulated by LocalStack.

### Code Modification

After modifying a service's code:

```bash
# Rebuild and restart the service
docker-compose -f docker-compose-full.yml up --build -d [service-name]

# Example for file-service
docker-compose -f docker-compose-full.yml up --build -d file-service
```

### Debugging

To debug a service:

```bash
# View detailed logs
./logs-full-stack.sh [service-name] --follow

# Access the container
docker-compose -f docker-compose-full.yml exec [service-name] sh

# Example to debug file-worker
docker-compose -f docker-compose-full.yml exec file-worker sh
```

## Environment Variables

All services are configured with appropriate environment variables to work together. Main configurations:

- **AWS**: Uses LocalStack with test credentials
- **Database**: PostgreSQL with default credentials
- **Redis**: Default configuration
- **Logging**: INFO level for all services

## Troubleshooting

### Common Issues

1. **Port already in use**: Check that no other service is using ports 3000, 3001, 4566, 5432, 6379

2. **Insufficient memory**: The complete stack requires at least 4 GB of RAM

3. **Services not starting**: Check logs with `./logs-full-stack.sh [service-name]`

### Complete Cleanup

If you encounter persistent issues:

```bash
# Stop and remove everything
docker-compose -f docker-compose-full.yml down --volumes --remove-orphans

# Remove built images
docker rmi $(docker images "filehunt*" -q)

# Restart
./start-full-stack.sh
```

## Differences from docker-compose.yml

The `docker-compose-full.yml` file extends `docker-compose.yml` by adding:

- All workers as Docker services
- Network configuration for inter-service communication
- Environment variables optimized for containerized environment
- Centralized log management

## Performance

To optimize performance in development:

- Use an SSD for Docker
- Allocate sufficient RAM to Docker (recommended: 6-8 GB)
- Close unnecessary applications

## Security

⚠️ **Important**: This configuration is for development only. For production:

- Change all default passwords
- Use real AWS services instead of LocalStack
- Configure TLS/SSL
- Use a reverse proxy (nginx, traefik, etc.)
