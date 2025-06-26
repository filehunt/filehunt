#!/bin/bash

# Stop development stack script for Filehunt
set -e

echo "🛑 Stopping Filehunt development stack..."

# Function to stop a service by PID file
stop_service() {
    local service_name=$1
    local pid_file="tmp/logs/$service_name.pid"
    
    if [ -f "$pid_file" ]; then
        local pid=$(cat "$pid_file")
        if ps -p $pid > /dev/null 2>&1; then
            echo "🔴 Stopping $service_name (PID: $pid)..."
            kill $pid
            sleep 2
            
            # Force kill if still running
            if ps -p $pid > /dev/null 2>&1; then
                echo "⚡ Force stopping $service_name..."
                kill -9 $pid
            fi
        else
            echo "⚠️  $service_name was not running"
        fi
        rm -f "$pid_file"
    else
        echo "ℹ️  No PID file found for $service_name"
    fi
}

# Stop Rust services
echo "🦀 Stopping Rust services..."
stop_service "git-service"
stop_service "file-service"
stop_service "user-service"
stop_service "search-service"
stop_service "api-gateway"

# Stop Docker services
echo "🐳 Stopping Docker services..."
docker-compose down

# Stop any remaining Rust processes
echo "🧹 Cleaning up remaining processes..."
pkill -f "target/debug/git-service" 2>/dev/null || true
pkill -f "target/debug/file-service" 2>/dev/null || true
pkill -f "target/debug/user-service" 2>/dev/null || true
pkill -f "target/debug/search-service" 2>/dev/null || true
pkill -f "target/debug/api-gateway" 2>/dev/null || true

# Clean up log files (optional)
read -p "🗑️  Do you want to clean up log files? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🧽 Cleaning up logs..."
    rm -f tmp/logs/*.log
    rm -f tmp/logs/*.pid
fi

echo ""
echo "✅ Development stack stopped successfully!"
echo ""
echo "💡 To start again, run:"
echo "   ./scripts/start-dev-stack.sh"