.PHONY: help test-git-service test-all setup-local setup-docker clean install-deps check-deps

# Default target
help:
	@echo "FileHunt E2E Testing"
	@echo "==================="
	@echo "test-git-service   - Run git-service E2E tests"
	@echo "test-all          - Run all E2E tests"
	@echo "setup-local       - Setup local testing environment"
	@echo "setup-docker      - Setup Docker testing environment"
	@echo "install-deps      - Install testing dependencies"
	@echo "check-deps        - Check if dependencies are installed"
	@echo "clean            - Clean test artifacts"

# Check dependencies
check-deps:
	@echo "Checking E2E testing dependencies..."
	@command -v http >/dev/null 2>&1 || { echo "❌ HTTPie not installed. Run 'make install-deps'"; exit 1; }
	@command -v jq >/dev/null 2>&1 || { echo "❌ jq not installed. Please install jq"; exit 1; }
	@command -v curl >/dev/null 2>&1 || { echo "❌ curl not installed. Please install curl"; exit 1; }
	@echo "✅ All dependencies are installed"

# Install dependencies
install-deps:
	@echo "Installing E2E testing dependencies..."
	@if command -v pip >/dev/null 2>&1; then \
		pip install httpie; \
	elif command -v pip3 >/dev/null 2>&1; then \
		pip3 install httpie; \
	else \
		echo "❌ pip not found. Please install Python and pip first"; \
		exit 1; \
	fi
	@echo "✅ HTTPie installed. Please install jq manually if not present"

# Setup local environment
setup-local: check-deps
	@echo "Setting up local E2E testing environment..."
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "✅ Created .env file from template"; \
	fi
	@echo "🔍 Checking if git-service is running..."
	@curl -f http://localhost:3000/health >/dev/null 2>&1 || { \
		echo "❌ Git service not running. Please start it first:"; \
		echo "   cd ../apps/git-service && make dev"; \
		exit 1; \
	}
	@echo "✅ Local environment ready"

# Setup Docker environment
setup-docker: check-deps
	@echo "Setting up Docker E2E testing environment..."
	@echo "🐳 This assumes services are running in Docker Compose"
	@echo "✅ Docker environment configured"

# Run git-service E2E tests
test-git-service: setup-local
	@echo "🚀 Running git-service E2E tests..."
	./test_git_service.sh

# Run git-service tests with custom URL
test-git-service-url:
	@read -p "Enter git-service URL (default: http://localhost:3000): " url; \
	url=$${url:-http://localhost:3000}; \
	BASE_URL=$$url ./test_git_service.sh

# Run all E2E tests
test-all: test-git-service
	@echo "🎉 All E2E tests completed"

# Validate HTTPie collection
validate-collection:
	@echo "📋 Validating HTTPie collection..."
	@if command -v python3 >/dev/null 2>&1; then \
		python3 -m json.tool git_service.json >/dev/null && echo "✅ git_service.json is valid JSON"; \
	else \
		jq empty git_service.json && echo "✅ git_service.json is valid JSON"; \
	fi
	@echo "✅ Collection validation completed"

# Import collection to HTTPie Desktop (if installed)
import-collection:
	@echo "📥 Collection import instructions:"
	@echo "1. Open HTTPie Desktop"
	@echo "2. Go to File → Import"
	@echo "3. Select: $(PWD)/git_service.json"
	@echo "4. Choose environment from environments.json"

# Generate test report
report:
	@echo "📊 E2E Test Report"
	@echo "=================="
	@echo "Collection: git_service.json"
	@echo "Requests: $$(jq '.requests | length' git_service.json)"
	@echo "Scenarios: $$(jq '.scenarios | length' git_service.json)"
	@echo "Environments: $$(jq '.environments | length' environments.json)"
	@echo "Last modified: $$(stat -f "%Sm" git_service.json 2>/dev/null || stat -c "%y" git_service.json 2>/dev/null || echo "Unknown")"

# Clean test artifacts
clean:
	@echo "🧹 Cleaning E2E test artifacts..."
	@rm -f /tmp/health_response.json
	@rm -f /tmp/repo_*.json
	@rm -f /tmp/commits_*.json
	@rm -f /tmp/commit_*.json
	@rm -f /tmp/error_*.json
	@rm -f /tmp/commit_file.txt
	@rm -f /tmp/paginated_commits.json
	@rm -rf ./test-results
	@echo "✅ Cleanup completed"

# Quick health check
health:
	@echo "🔍 Quick health check..."
	@http GET localhost:3000/health --timeout=10 --print=HhBb || echo "❌ Service not responding"

# Interactive test mode
interactive:
	@echo "🎮 Interactive E2E Testing"
	@echo "=========================="
	@echo "Available commands:"
	@echo "  1) Health Check"
	@echo "  2) Create Repository"
	@echo "  3) List Repositories"
	@echo "  4) Create Commit"
	@echo "  5) List Commits"
	@echo "  6) Full Test Suite"
	@echo "  7) Exit"
	@while true; do \
		read -p "Choose option (1-7): " choice; \
		case $$choice in \
			1) http GET localhost:3000/health ;; \
			2) http POST localhost:3000/repositories name="interactive-test" owner="manual" description="Manual test" ;; \
			3) http GET localhost:3000/repositories ;; \
			4) read -p "Repository ID: " repo_id; \
			   http POST localhost:3000/repositories/$$repo_id/commits message="Interactive commit" author="manual@test.com" file_path="/test.txt" repository_id="$$repo_id" ;; \
			5) read -p "Repository ID: " repo_id; \
			   http GET localhost:3000/repositories/$$repo_id/commits ;; \
			6) make test-git-service ;; \
			7) break ;; \
			*) echo "Invalid option" ;; \
		esac; \
	done

# Performance test (basic)
perf-test:
	@echo "⚡ Basic Performance Test"
	@echo "Running 10 concurrent health checks..."
	@for i in $$(seq 1 10); do \
		(time http GET localhost:3000/health --timeout=5 >/dev/null 2>&1) & \
	done; wait
	@echo "✅ Performance test completed"

# Environment-specific tests
test-local: 
	@BASE_URL=http://localhost:3000 ./test_git_service.sh

test-docker:
	@BASE_URL=http://git-service:3000 ./test_git_service.sh

test-staging:
	@BASE_URL=https://git-service-staging.filehunt.com ./test_git_service.sh

# Smoke test (minimal)
smoke:
	@echo "💨 Smoke Test"
	@http GET localhost:3000/health --timeout=5 --check-status
	@echo "✅ Smoke test passed"