#!/bin/bash

set -e

echo "📊 Filehunt Full Stack - Log Viewer"
echo "=================================="

# Function to show available services
show_services() {
    echo ""
    echo "Available services:"
    echo "  1. postgres"
    echo "  2. redis"
    echo "  3. localstack"
    echo "  4. aws-setup"
    echo "  5. file-service"
    echo "  6. git-service"
    echo "  7. file-worker"
    echo "  8. file-indexer"
    echo "  9. notification-worker"
    echo "  10. all (show all logs)"
    echo ""
}

# Function to show logs for a specific service
show_logs() {
    local service=$1
    local follow=${2:-false}
    
    if [ "$follow" = "true" ]; then
        echo "📋 Following logs for $service (Press Ctrl+C to stop)..."
        docker-compose -f docker-compose-full.yml logs -f "$service"
    else
        echo "📋 Showing recent logs for $service..."
        docker-compose -f docker-compose-full.yml logs --tail=50 "$service"
    fi
}

# Function to show all logs
show_all_logs() {
    local follow=${1:-false}
    
    if [ "$follow" = "true" ]; then
        echo "📋 Following all logs (Press Ctrl+C to stop)..."
        docker-compose -f docker-compose-full.yml logs -f
    else
        echo "📋 Showing recent logs for all services..."
        docker-compose -f docker-compose-full.yml logs --tail=20
    fi
}

# Check if docker-compose-full.yml exists
if [ ! -f "docker-compose-full.yml" ]; then
    echo "❌ docker-compose-full.yml not found in current directory"
    exit 1
fi

# Parse command line arguments
if [ $# -eq 0 ]; then
    show_services
    echo "Usage:"
    echo "  $0 <service-name>           # Show recent logs"
    echo "  $0 <service-name> --follow  # Follow logs in real-time"
    echo "  $0 all                      # Show all recent logs"
    echo "  $0 all --follow             # Follow all logs in real-time"
    echo ""
    echo "Examples:"
    echo "  $0 file-service"
    echo "  $0 file-worker --follow"
    echo "  $0 all"
    exit 0
fi

SERVICE=$1
FOLLOW_FLAG=${2:-""}

case $SERVICE in
    "postgres"|"redis"|"localstack"|"aws-setup"|"file-service"|"git-service"|"file-worker"|"file-indexer"|"notification-worker")
        if [ "$FOLLOW_FLAG" = "--follow" ] || [ "$FOLLOW_FLAG" = "-f" ]; then
            show_logs "$SERVICE" true
        else
            show_logs "$SERVICE" false
        fi
        ;;
    "all")
        if [ "$FOLLOW_FLAG" = "--follow" ] || [ "$FOLLOW_FLAG" = "-f" ]; then
            show_all_logs true
        else
            show_all_logs false
        fi
        ;;
    *)
        echo "❌ Unknown service: $SERVICE"
        show_services
        exit 1
        ;;
esac