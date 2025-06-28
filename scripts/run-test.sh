#!/bin/bash

# Convenience script to run messaging tests
# This script starts the necessary services and runs the messaging tests

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker and Docker Compose are available
check_dependencies() {
    if ! command -v docker &> /dev/null; then
        echo_error "Docker is not installed or not in PATH"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        echo_error "Docker Compose is not installed or not in PATH"
        exit 1
    fi
}

# Start LocalStack if not running
start_localstack() {
    echo_info "Starting LocalStack..."
    
    # Use docker compose if available, fallback to docker-compose
    if docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi
    
    # Start LocalStack and aws-setup
    $COMPOSE_CMD up -d localstack
    
    # Wait for LocalStack to be healthy
    echo_info "Waiting for LocalStack to be healthy..."
    timeout=120
    counter=0
    
    while [ $counter -lt $timeout ]; do
        if docker inspect filehunt-localstack --format='{{.State.Health.Status}}' 2>/dev/null | grep -q "healthy"; then
            echo_info "LocalStack is healthy!"
            break
        fi
        
        counter=$((counter + 5))
        echo_info "Waiting... ($counter/$timeout seconds)"
        sleep 5
    done
    
    if [ $counter -ge $timeout ]; then
        echo_error "LocalStack failed to become healthy within $timeout seconds"
        echo_error "Check logs with: docker logs filehunt-localstack"
        exit 1
    fi
    
    # Run AWS setup
    echo_info "Setting up AWS infrastructure..."
    $COMPOSE_CMD up aws-setup
    
    if [ $? -ne 0 ]; then
        echo_error "AWS setup failed. Check logs with: docker logs filehunt-aws-setup"
        exit 1
    fi
}

# Run the messaging tests
run_tests() {
    echo_info "Running messaging tests..."
    
    # Check if jq is available (needed for tests)
    if ! command -v jq &> /dev/null; then
        echo_error "jq is not installed. Please install jq to run the tests."
        echo_info "On macOS: brew install jq"
        echo_info "On Ubuntu/Debian: sudo apt-get install jq"
        echo_info "On CentOS/RHEL: sudo yum install jq"
        exit 1
    fi
    
    # Run the messaging test script
    ./scripts/test-messaging.sh
}

# Show services status
show_status() {
    echo_info "=== Docker Services Status ==="
    
    # Use docker compose if available, fallback to docker-compose
    if docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi
    
    $COMPOSE_CMD ps localstack aws-setup 2>/dev/null || echo_warn "Some services may not be running"
    
    # Show LocalStack health
    echo_info "=== LocalStack Health ==="
    curl -s http://localhost:4566/_localstack/health | jq '.' 2>/dev/null || echo_warn "Could not get LocalStack health status"
}

# Clean up services
cleanup() {
    echo_info "Cleaning up services..."
    
    # Use docker compose if available, fallback to docker-compose
    if docker compose version &> /dev/null; then
        COMPOSE_CMD="docker compose"
    else
        COMPOSE_CMD="docker-compose"
    fi
    
    $COMPOSE_CMD down localstack aws-setup 2>/dev/null || echo_warn "Some services were not running"
    echo_info "Cleanup complete"
}

# Show usage
show_usage() {
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Convenience script to manage and test messaging infrastructure"
    echo ""
    echo "Commands:"
    echo "  test      Start services and run messaging tests (default)"
    echo "  start     Start LocalStack and set up AWS infrastructure"
    echo "  status    Show status of services and LocalStack health"
    echo "  cleanup   Stop and remove services"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0              # Run tests (default)"
    echo "  $0 test         # Run tests"
    echo "  $0 start        # Only start services"
    echo "  $0 status       # Check status"
    echo "  $0 cleanup      # Clean up"
}

# Main function
main() {
    local command="${1:-test}"
    
    case "$command" in
        "test")
            check_dependencies
            start_localstack
            run_tests
            ;;
        "start")
            check_dependencies
            start_localstack
            echo_info "Services started successfully!"
            echo_info "You can now run tests with: ./scripts/test-messaging.sh"
            ;;
        "status")
            show_status
            ;;
        "cleanup")
            cleanup
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        *)
            echo_error "Unknown command: $command"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"