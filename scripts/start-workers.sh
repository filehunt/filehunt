#!/bin/bash

# Start All Workers Script
# This script starts both notification-worker and file-worker simultaneously

set -e

echo "🚀 Starting Filehunt Workers..."
echo "================================"

# Check if LocalStack is running
if ! curl -s http://localhost:4566/health > /dev/null 2>&1; then
    echo "❌ LocalStack is not running on port 4566"
    echo "Please start LocalStack first: docker-compose up localstack"
    exit 1
fi

echo "✅ LocalStack is running"

# Set common environment variables
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
export SQS_ENDPOINT=http://localhost:4566

# Worker-specific environment variables
export QUEUE_URL_NOTIFICATIONS=http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/notifications-queue
export QUEUE_URL_FILE_PROCESSING=http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/file-processing-queue
export LOG_LEVEL=debug
export RUST_LOG=info

echo "🔧 Environment configured for LocalStack"
echo ""

# Function to start notification worker
start_notification_worker() {
    echo "📧 Starting Notification Worker (NestJS)..."
    cd notification-worker
    npm run start:dev
}

# Function to start file worker
start_file_worker() {
    echo "📁 Starting File Worker (Rust)..."
    cd file-worker
    cargo run
}

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "🛑 Shutting down workers..."
    kill $(jobs -p) 2>/dev/null || true
    wait
    echo "✅ All workers stopped"
    exit 0
}

# Set up signal handlers for graceful shutdown
trap cleanup SIGINT SIGTERM

echo "Starting workers in parallel..."
echo "Press Ctrl+C to stop all workers"
echo ""

# Start both workers in background
(start_notification_worker) &
NOTIFICATION_PID=$!

(start_file_worker) &
FILE_PID=$!

echo "🔄 Workers started:"
echo "  - Notification Worker (PID: $NOTIFICATION_PID)"
echo "  - File Worker (PID: $FILE_PID)"
echo ""
echo "📋 To test the workers:"
echo "  cd workers && npm run test:event"
echo "  or"
echo "  cd workers && npm run test:multiple"
echo ""

# Wait for both processes
wait $NOTIFICATION_PID $FILE_PID