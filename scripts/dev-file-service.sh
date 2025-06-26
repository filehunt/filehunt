#!/bin/bash

# Development startup script for file-service
set -e

echo "Starting file-service development environment..."

# Check if required tools are installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: docker-compose is required but not installed"
    exit 1
fi

if ! command -v cargo &> /dev/null; then
    echo "Error: cargo is required but not installed"
    exit 1
fi

# Create necessary directories
mkdir -p tmp/logs tmp/localstack data/git-repositories

# Start infrastructure services
echo "Starting infrastructure services (PostgreSQL, Redis, LocalStack)..."
docker-compose up -d postgres redis localstack

# Wait for services to be ready
echo "Waiting for services to be ready..."
sleep 10

# Run AWS setup
echo "Setting up AWS resources..."
docker-compose up aws-setup

# Navigate to file-service directory
cd "$(dirname "$0")/../apps/file-service"

# Copy environment file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
fi

# Export environment variables
export DATABASE_URL="postgresql://filehunt:filehunt_password@localhost:5432/filehunt"
export REDIS_URL="redis://localhost:6379"
export AWS_REGION="us-east-1"
export AWS_ACCESS_KEY_ID="test"
export AWS_SECRET_ACCESS_KEY="test"
export S3_ENDPOINT="http://localhost:4566"
export S3_BUCKET="filehunt-files"
export S3_PRESIGNED_URL_EXPIRY="3600"
export KMS_KEY_ID="alias/filehunt-file-encryption"
export SQS_ENDPOINT="http://localhost:4566"
export FILE_PROCESSING_QUEUE_URL="http://localhost:4566/000000000000/file-processing-queue.fifo"
export NOTIFICATIONS_QUEUE_URL="http://localhost:4566/000000000000/notifications-queue.fifo"
export GIT_SERVICE_URL="http://localhost:3000"
export MAX_FILE_SIZE="104857600"
export ALLOWED_FILE_TYPES="image/jpeg,image/png,image/gif,text/plain,application/pdf,video/mp4,audio/mpeg,application/json,text/markdown"
export LOG_LEVEL="info"
export RUST_LOG="file_service=debug,tower_http=debug"

echo "Environment variables set"

# Start the file service
echo "Starting file-service..."
echo "Service will be available at http://localhost:3001"
echo "Health check: http://localhost:3001/health"
echo ""
echo "Press Ctrl+C to stop the service"

cargo run