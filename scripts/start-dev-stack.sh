#!/bin/bash

# Full development stack startup script for Filehunt
set -e

echo "🚀 Starting Filehunt development stack..."

# Check if required tools are installed
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "❌ Error: $1 is required but not installed"
        exit 1
    fi
}

check_command docker-compose
check_command cargo

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p tmp/logs tmp/localstack data/git-repositories

# Start infrastructure services
echo "🔧 Starting infrastructure services..."
docker-compose up -d postgres redis localstack

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check if services are healthy
echo "🔍 Checking service health..."
docker-compose ps

# Run AWS setup
echo "☁️ Setting up AWS resources..."
docker-compose up aws-setup

# Export common environment variables
export AWS_REGION="us-east-1"
export AWS_ACCESS_KEY_ID="test"
export AWS_SECRET_ACCESS_KEY="test"
export S3_ENDPOINT="http://localhost:4566"
export SQS_ENDPOINT="http://localhost:4566"
export DATABASE_URL="postgresql://filehunt:filehunt_password@localhost:5432/filehunt"
export REDIS_URL="redis://localhost:6379"

echo "✅ Infrastructure ready!"
echo ""
echo "🌟 Available services:"
echo "   - PostgreSQL: localhost:5432"
echo "   - Redis: localhost:6379"
echo "   - LocalStack: localhost:4566"
echo ""
echo "📚 S3 Buckets created:"
echo "   - filehunt-git-service"
echo "   - filehunt-files"
echo "   - filehunt-shared"
echo ""
echo "📡 SQS Queues created:"
echo "   - file-processing-queue.fifo"
echo "   - notifications-queue.fifo"
echo ""

# Function to start a service in background
start_service() {
    local service_name=$1
    local service_dir=$2
    local port=$3
    
    echo "🚀 Starting $service_name..."
    cd "apps/$service_dir"
    
    # Check if .env exists, create from example if not
    if [ ! -f ".env" ]; then
        echo "📝 Creating .env file for $service_name..."
        cp .env.example .env 2>/dev/null || true
    fi
    
    # Start service in background
    cargo run > "../../tmp/logs/$service_name.log" 2>&1 &
    local pid=$!
    echo $pid > "../../tmp/logs/$service_name.pid"
    
    echo "✅ $service_name started (PID: $pid) - logs: tmp/logs/$service_name.log"
    echo "   🌐 Available at: http://localhost:$port"
    
    cd ../..
}

# Start git-service
if [ -d "apps/git-service" ]; then
    start_service "git-service" "git-service" "3000"
    sleep 3
fi

# Start file-service
if [ -d "apps/file-service" ]; then
    start_service "file-service" "file-service" "3001"
    sleep 3
fi

# Start other services if they exist
if [ -d "apps/user-service" ]; then
    start_service "user-service" "user-service" "3002"
    sleep 3
fi

if [ -d "apps/search-service" ]; then
    start_service "search-service" "search-service" "3003"
    sleep 3
fi

if [ -d "apps/api-gateway" ]; then
    start_service "api-gateway" "api-gateway" "8080"
    sleep 3
fi

echo ""
echo "🎉 Development stack started successfully!"
echo ""
echo "🔗 Quick links:"
echo "   - Git Service: http://localhost:3000/health"
echo "   - File Service: http://localhost:3001/health"
echo "   - LocalStack Dashboard: http://localhost:4566"
echo ""
echo "📋 To stop all services, run:"
echo "   ./scripts/stop-dev-stack.sh"
echo ""
echo "📊 To view logs:"
echo "   tail -f tmp/logs/git-service.log"
echo "   tail -f tmp/logs/file-service.log"
echo ""
echo "🧪 To test file-service:"
echo "   ./scripts/test-file-service.sh"