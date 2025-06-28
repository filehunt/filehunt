#!/bin/bash

set -e

echo "🚀 Starting Filehunt Full Stack..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p ./tmp/logs
mkdir -p ./tmp/localstack
mkdir -p ./data/git-repositories

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose-full.yml down --remove-orphans

# Build and start all services
echo "🔨 Building and starting all services..."
docker-compose -f docker-compose-full.yml up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 10

# Check service status
echo "📊 Checking service status..."
docker-compose -f docker-compose-full.yml ps

echo ""
echo "✅ Filehunt Full Stack is now running!"
echo ""
echo "📋 Services available:"
echo "  - File Service: http://localhost:3001"
echo "  - Git Service: http://localhost:3000"
echo "  - PostgreSQL: localhost:5432"
echo "  - Redis: localhost:6379"
echo "  - LocalStack: http://localhost:4566"
echo ""
echo "🔍 Workers running:"
echo "  - File Worker"
echo "  - File Indexer"
echo "  - Notification Worker"
echo ""
echo "📝 To view logs:"
echo "  docker-compose -f docker-compose-full.yml logs -f [service-name]"
echo ""
echo "🛑 To stop all services:"
echo "  docker-compose -f docker-compose-full.yml down"