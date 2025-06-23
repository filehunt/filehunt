.PHONY: help build run test check fmt clippy clean dev setup-localstack stop-localstack test-api

# Default target
help:
	@echo "Git Service Development Commands"
	@echo "================================"
	@echo "build          - Build the project"
	@echo "run            - Run the service locally"
	@echo "test           - Run unit tests"
	@echo "check          - Check code compilation"
	@echo "fmt            - Format code"
	@echo "clippy         - Run clippy linter"
	@echo "clean          - Clean build artifacts"
	@echo "dev            - Start development environment (LocalStack + Service)"
	@echo "setup-localstack - Start LocalStack with S3 setup"
	@echo "stop-localstack  - Stop LocalStack"
	@echo "test-api       - Run API integration tests"

# Build the project
build:
	cargo build

# Run the service locally
run:
	cargo run

# Run unit tests
test:
	cargo test

# Check code compilation
check:
	cargo check

# Format code
fmt:
	cargo fmt

# Run clippy linter
clippy:
	cargo clippy -- -D warnings

# Clean build artifacts
clean:
	cargo clean

# Start development environment
dev: setup-localstack
	@echo "Waiting for LocalStack to be ready..."
	@sleep 5
	@echo "Starting git-service..."
	cargo run

# Setup LocalStack with S3
setup-localstack:
	@echo "Starting LocalStack..."
	docker-compose -f docker-compose.dev.yml up -d
	@echo "Initializing S3 bucket and configuration..."
	./scripts/init-localstack.sh

# Stop LocalStack
stop-localstack:
	@echo "Stopping LocalStack..."
	docker-compose -f docker-compose.dev.yml down

# Run API integration tests
test-api:
	@echo "Running API integration tests..."
	@if ! pgrep -f "git-service" > /dev/null; then \
		echo "Error: git-service is not running. Please start it first with 'make run' or 'make dev'"; \
		exit 1; \
	fi
	./test_api.sh

# Create .env file from example
env:
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo ".env file created from .env.example"; \
	else \
		echo ".env file already exists"; \
	fi

# Full development setup
setup: env setup-localstack
	@echo "Development environment is ready!"
	@echo "Run 'make run' to start the service"