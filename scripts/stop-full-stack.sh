#!/bin/bash

set -e

echo "🛑 Stopping Filehunt Full Stack..."

# Stop all services
echo "⏹️  Stopping all containers..."
docker-compose -f docker-compose-full.yml down --remove-orphans

# Optional: Remove volumes (uncomment if you want to clean up data)
# echo "🗑️  Removing volumes..."
# docker-compose -f docker-compose-full.yml down --volumes

# Show status
echo "📊 Final status:"
docker-compose -f docker-compose-full.yml ps

echo ""
echo "✅ Filehunt Full Stack has been stopped!"
echo ""
echo "💡 To clean up volumes as well, run:"
echo "  docker-compose -f docker-compose-full.yml down --volumes"
echo ""
echo "🚀 To start again, run:"
echo "  ./start-full-stack.sh"