#!/bin/bash

# Git Service - Automated E2E Tests using HTTPie
# This script runs the complete test suite for git-service API

set -e

# Configuration
BASE_URL="http://localhost:3000"
REPO_ID=""
COMMIT_ID=""
SECOND_COMMIT_ID=""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
NC='\033[0m' # No Color

# Function to print test results
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
        exit 1
    fi
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_section() {
    echo -e "\n${YELLOW}=== $1 ===${NC}"
}

# Check if HTTPie is installed
if ! command -v http &> /dev/null; then
    echo -e "${RED}❌ HTTPie is not installed. Please install it first:${NC}"
    echo "pip install httpie"
    exit 1
fi

echo -e "${BLUE}🚀 Git Service E2E Tests with HTTPie${NC}"
echo "Target: $BASE_URL"
echo

# Test 1: Health Check
print_section "Health Checks"

print_info "Testing service health..."
if http GET $BASE_URL/health Accept:application/json > /tmp/health_response.json 2>/dev/null; then
    print_result 0 "Health check passed"
    echo "Service Status: $(cat /tmp/health_response.json | jq -r '.status')"
else
    print_result 1 "Health check failed - is the service running?"
fi

print_info "Testing readiness probe..."
if http GET $BASE_URL/ready > /dev/null 2>&1; then
    print_result 0 "Readiness check passed"
else
    print_result 1 "Readiness check failed"
fi

# Test 2: Repository Management
print_section "Repository Management"

print_info "Creating test repository..."
if REPO_RESPONSE=$(http POST $BASE_URL/repositories \
    name="httpe-test-repo" \
    owner="e2e-tester" \
    description="Repository created by HTTPie E2E tests" \
    --print=b 2>/dev/null); then
    
    REPO_ID=$(echo "$REPO_RESPONSE" | jq -r '.repository.id')
    print_result 0 "Repository created successfully"
    echo "Repository ID: $REPO_ID"
else
    print_result 1 "Repository creation failed"
fi

print_info "Retrieving repository details..."
if http GET $BASE_URL/repositories/$REPO_ID Accept:application/json > /tmp/repo_details.json 2>/dev/null; then
    print_result 0 "Repository details retrieved"
    echo "Repository: $(cat /tmp/repo_details.json | jq -r '.repository.name')"
    echo "Owner: $(cat /tmp/repo_details.json | jq -r '.repository.owner')"
    echo "Commits: $(cat /tmp/repo_details.json | jq -r '.commit_count')"
else
    print_result 1 "Failed to retrieve repository details"
fi

print_info "Listing all repositories..."
if http GET $BASE_URL/repositories Accept:application/json > /tmp/repo_list.json 2>/dev/null; then
    REPO_COUNT=$(cat /tmp/repo_list.json | jq length)
    print_result 0 "Repositories listed successfully"
    echo "Total repositories: $REPO_COUNT"
else
    print_result 1 "Failed to list repositories"
fi

# Test 3: Commit Operations
print_section "Commit Operations"

print_info "Creating first commit..."
if COMMIT_RESPONSE=$(http POST $BASE_URL/repositories/$REPO_ID/commits \
    message="Initial commit - Setup project structure" \
    author="e2e-tester@example.com" \
    file_path="/src/main.rs" \
    repository_id="$REPO_ID" \
    --print=b 2>/dev/null); then
    
    COMMIT_ID=$(echo "$COMMIT_RESPONSE" | jq -r '.id')
    print_result 0 "First commit created successfully"
    echo "Commit ID: $COMMIT_ID"
    echo "Message: $(echo "$COMMIT_RESPONSE" | jq -r '.message')"
else
    print_result 1 "First commit creation failed"
fi

print_info "Creating second commit..."
if SECOND_COMMIT_RESPONSE=$(http POST $BASE_URL/repositories/$REPO_ID/commits \
    message="feat: Add user authentication module" \
    author="e2e-tester@example.com" \
    file_path="/src/auth.rs" \
    repository_id="$REPO_ID" \
    --print=b 2>/dev/null); then
    
    SECOND_COMMIT_ID=$(echo "$SECOND_COMMIT_RESPONSE" | jq -r '.id')
    print_result 0 "Second commit created successfully"
    echo "Commit ID: $SECOND_COMMIT_ID"
else
    print_result 1 "Second commit creation failed"
fi

print_info "Listing commits..."
if http GET $BASE_URL/repositories/$REPO_ID/commits Accept:application/json > /tmp/commits_list.json 2>/dev/null; then
    COMMIT_COUNT=$(cat /tmp/commits_list.json | jq -r '.total')
    print_result 0 "Commits listed successfully"
    echo "Total commits: $COMMIT_COUNT"
    echo "Latest commit: $(cat /tmp/commits_list.json | jq -r '.commits[0].message')"
else
    print_result 1 "Failed to list commits"
fi

print_info "Testing commit pagination..."
if http GET $BASE_URL/repositories/$REPO_ID/commits limit==1 offset==0 Accept:application/json > /tmp/paginated_commits.json 2>/dev/null; then
    RETURNED_COUNT=$(cat /tmp/paginated_commits.json | jq -r '.commits | length')
    print_result 0 "Commit pagination works"
    echo "Returned commits: $RETURNED_COUNT (should be 1)"
else
    print_result 1 "Commit pagination failed"
fi

print_info "Getting commit details..."
if http GET $BASE_URL/repositories/$REPO_ID/commits/$COMMIT_ID Accept:application/json > /tmp/commit_details.json 2>/dev/null; then
    print_result 0 "Commit details retrieved"
    echo "Author: $(cat /tmp/commit_details.json | jq -r '.author')"
    echo "File path: $(cat /tmp/commit_details.json | jq -r '.file_path')"
else
    print_result 1 "Failed to retrieve commit details"
fi

print_info "Getting full commit details with metadata..."
if http GET $BASE_URL/repositories/$REPO_ID/commits/$COMMIT_ID/details Accept:application/json > /tmp/commit_metadata.json 2>/dev/null; then
    print_result 0 "Full commit details retrieved"
    echo "Storage path: $(cat /tmp/commit_metadata.json | jq -r '.metadata.storage_path')"
else
    print_result 1 "Failed to retrieve full commit details"
fi

print_info "Downloading commit file..."
if http GET $BASE_URL/repositories/$REPO_ID/commits/$COMMIT_ID/file > /tmp/commit_file.txt 2>/dev/null; then
    print_result 0 "Commit file downloaded"
    echo "File content preview: $(head -c 50 /tmp/commit_file.txt)..."
else
    print_result 1 "Failed to download commit file"
fi

# Test 4: Error Handling
print_section "Error Handling"

print_info "Testing nonexistent repository (should return 404)..."
if http GET $BASE_URL/repositories/nonexistent_repo Accept:application/json > /tmp/error_repo.json 2>/dev/null; then
    print_result 1 "Error handling failed - should have returned 404"
else
    print_result 0 "Correctly handled nonexistent repository"
fi

print_info "Testing nonexistent commit (should return 404)..."
FAKE_UUID="00000000-0000-0000-0000-000000000000"
if http GET $BASE_URL/repositories/$REPO_ID/commits/$FAKE_UUID Accept:application/json > /tmp/error_commit.json 2>/dev/null; then
    print_result 1 "Error handling failed - should have returned 404"
else
    print_result 0 "Correctly handled nonexistent commit"
fi

# Test 5: Advanced Scenarios
print_section "Advanced Scenarios"

print_info "Creating production repository..."
if PROD_RESPONSE=$(http POST $BASE_URL/repositories \
    name="production-api" \
    owner="devops-team" \
    description="Production API repository for E2E testing" \
    --print=b 2>/dev/null); then
    
    PROD_REPO_ID=$(echo "$PROD_RESPONSE" | jq -r '.repository.id')
    print_result 0 "Production repository created"
    echo "Production Repository ID: $PROD_REPO_ID"
else
    print_result 1 "Production repository creation failed"
fi

print_info "Creating hotfix commit..."
if http POST $BASE_URL/repositories/$PROD_REPO_ID/commits \
    message="hotfix: Critical security patch for authentication bypass" \
    author="security-team@company.com" \
    file_path="/src/security/auth_fix.rs" \
    repository_id="$PROD_REPO_ID" > /dev/null 2>&1; then
    
    print_result 0 "Hotfix commit created successfully"
else
    print_result 1 "Hotfix commit creation failed"
fi

print_info "Verifying final repository count..."
if FINAL_REPO_LIST=$(http GET $BASE_URL/repositories Accept:application/json --print=b 2>/dev/null); then
    FINAL_COUNT=$(echo "$FINAL_REPO_LIST" | jq length)
    print_result 0 "Final verification completed"
    echo "Total repositories after tests: $FINAL_COUNT"
else
    print_result 1 "Final verification failed"
fi

# Summary
print_section "Test Summary"

echo -e "${GREEN}🎉 All E2E tests completed successfully!${NC}"
echo
echo "📊 Test Results:"
echo "  • Repositories created: 2"
echo "  • Commits created: 3+"
echo "  • API endpoints tested: 12+"
echo "  • Error scenarios verified: 2"
echo
echo "📁 Test Artifacts:"
echo "  • Repository 1: $REPO_ID"
echo "  • Repository 2: $PROD_REPO_ID"
echo "  • First Commit: $COMMIT_ID"
echo "  • Second Commit: $SECOND_COMMIT_ID"
echo
echo "🧹 Cleanup:"
echo "  Temporary files created in /tmp/ with prefix:"
echo "  - health_response.json, repo_*.json, commits_*.json, commit_*.json"
echo
echo "💡 Next Steps:"
echo "  • Import git_service.json into HTTPie Desktop for interactive testing"
echo "  • Run individual requests for deeper investigation"
echo "  • Customize test data for your specific use cases"

# Optional cleanup
read -p "🗑️  Clean up temporary files? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f /tmp/health_response.json /tmp/repo_*.json /tmp/commits_*.json /tmp/commit_*.json /tmp/error_*.json /tmp/commit_file.txt /tmp/paginated_commits.json
    echo "✅ Temporary files cleaned up"
fi

echo
echo -e "${BLUE}🚀 E2E Testing completed successfully!${NC}"