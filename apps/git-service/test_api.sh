#!/bin/bash

# Git Service API Test Script
set -e

BASE_URL="http://localhost:3000"
REPO_ID=""
COMMIT_ID=""

echo "🚀 Testing Git Service API"
echo "========================="

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
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
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Test 1: Health Check
echo
print_info "Testing health check..."
response=$(curl -s -w "%{http_code}" -o /tmp/health_response.json "$BASE_URL/health")
http_code=${response: -3}
if [ "$http_code" = "200" ]; then
    print_result 0 "Health check passed"
    cat /tmp/health_response.json | jq '.'
else
    print_result 1 "Health check failed (HTTP $http_code)"
fi

# Test 2: Readiness Check
echo
print_info "Testing readiness check..."
response=$(curl -s -w "%{http_code}" -o /dev/null "$BASE_URL/ready")
http_code=${response: -3}
if [ "$http_code" = "200" ]; then
    print_result 0 "Readiness check passed"
else
    print_result 1 "Readiness check failed (HTTP $http_code)"
fi

# Test 3: Create Repository
echo
print_info "Creating a test repository..."
response=$(curl -s -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{
        "name": "test-repo",
        "owner": "test-user",
        "description": "Test repository for API testing"
    }' \
    -o /tmp/create_repo_response.json \
    "$BASE_URL/repositories")

http_code=${response: -3}
if [ "$http_code" = "200" ]; then
    print_result 0 "Repository created successfully"
    REPO_ID=$(cat /tmp/create_repo_response.json | jq -r '.repository.id')
    echo "Repository ID: $REPO_ID"
    cat /tmp/create_repo_response.json | jq '.'
else
    print_result 1 "Repository creation failed (HTTP $http_code)"
    cat /tmp/create_repo_response.json
fi

# Test 4: Get Repository
echo
print_info "Getting repository details..."
response=$(curl -s -w "%{http_code}" -o /tmp/get_repo_response.json "$BASE_URL/repositories/$REPO_ID")
http_code=${response: -3}
if [ "$http_code" = "200" ]; then
    print_result 0 "Repository retrieved successfully"
    cat /tmp/get_repo_response.json | jq '.'
else
    print_result 1 "Repository retrieval failed (HTTP $http_code)"
fi

# Test 5: List Repositories
echo
print_info "Listing all repositories..."
response=$(curl -s -w "%{http_code}" -o /tmp/list_repos_response.json "$BASE_URL/repositories")
http_code=${response: -3}
if [ "$http_code" = "200" ]; then
    print_result 0 "Repositories listed successfully"
    cat /tmp/list_repos_response.json | jq '.'
else
    print_result 1 "Repository listing failed (HTTP $http_code)"
fi

# Test 6: Create Commit
echo
print_info "Creating a test commit..."
response=$(curl -s -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{
        "message": "Initial commit",
        "author": "test-user@example.com",
        "file_path": "/test/file.txt",
        "repository_id": "'$REPO_ID'"
    }' \
    -o /tmp/create_commit_response.json \
    "$BASE_URL/repositories/$REPO_ID/commits")

http_code=${response: -3}
if [ "$http_code" = "200" ]; then
    print_result 0 "Commit created successfully"
    COMMIT_ID=$(cat /tmp/create_commit_response.json | jq -r '.id')
    echo "Commit ID: $COMMIT_ID"
    cat /tmp/create_commit_response.json | jq '.'
else
    print_result 1 "Commit creation failed (HTTP $http_code)"
    cat /tmp/create_commit_response.json
fi

# Test 7: Get Commit
echo
print_info "Getting commit details..."
response=$(curl -s -w "%{http_code}" -o /tmp/get_commit_response.json "$BASE_URL/repositories/$REPO_ID/commits/$COMMIT_ID")
http_code=${response: -3}
if [ "$http_code" = "200" ]; then
    print_result 0 "Commit retrieved successfully"
    cat /tmp/get_commit_response.json | jq '.'
else
    print_result 1 "Commit retrieval failed (HTTP $http_code)"
fi

# Test 8: Get Commit Details (with metadata)
echo
print_info "Getting full commit details..."
response=$(curl -s -w "%{http_code}" -o /tmp/get_commit_details_response.json "$BASE_URL/repositories/$REPO_ID/commits/$COMMIT_ID/details")
http_code=${response: -3}
if [ "$http_code" = "200" ]; then
    print_result 0 "Commit details retrieved successfully"
    cat /tmp/get_commit_details_response.json | jq '.'
else
    print_result 1 "Commit details retrieval failed (HTTP $http_code)"
fi

# Test 9: List Commits
echo
print_info "Listing commits..."
response=$(curl -s -w "%{http_code}" -o /tmp/list_commits_response.json "$BASE_URL/repositories/$REPO_ID/commits")
http_code=${response: -3}
if [ "$http_code" = "200" ]; then
    print_result 0 "Commits listed successfully"
    cat /tmp/list_commits_response.json | jq '.'
else
    print_result 1 "Commits listing failed (HTTP $http_code)"
fi

# Test 10: Get Commit File
echo
print_info "Getting commit file content..."
response=$(curl -s -w "%{http_code}" -o /tmp/commit_file_content "$BASE_URL/repositories/$REPO_ID/commits/$COMMIT_ID/file")
http_code=${response: -3}
if [ "$http_code" = "200" ]; then
    print_result 0 "Commit file retrieved successfully"
    echo "File content:"
    cat /tmp/commit_file_content
    echo
else
    print_result 1 "Commit file retrieval failed (HTTP $http_code)"
fi

# Test 11: Create Second Commit
echo
print_info "Creating a second commit..."
response=$(curl -s -w "%{http_code}" -X POST \
    -H "Content-Type: application/json" \
    -d '{
        "message": "Second commit with changes",
        "author": "test-user@example.com",
        "file_path": "/test/file.txt",
        "repository_id": "'$REPO_ID'"
    }' \
    -o /tmp/create_commit2_response.json \
    "$BASE_URL/repositories/$REPO_ID/commits")

http_code=${response: -3}
if [ "$http_code" = "200" ]; then
    print_result 0 "Second commit created successfully"
    COMMIT_ID_2=$(cat /tmp/create_commit2_response.json | jq -r '.id')
    echo "Second Commit ID: $COMMIT_ID_2"
    cat /tmp/create_commit2_response.json | jq '.'
else
    print_result 1 "Second commit creation failed (HTTP $http_code)"
    cat /tmp/create_commit2_response.json
fi

# Test 12: List Commits with Pagination
echo
print_info "Testing pagination with limit=1..."
response=$(curl -s -w "%{http_code}" -o /tmp/list_commits_paginated_response.json "$BASE_URL/repositories/$REPO_ID/commits?limit=1&offset=0")
http_code=${response: -3}
if [ "$http_code" = "200" ]; then
    print_result 0 "Paginated commits retrieved successfully"
    cat /tmp/list_commits_paginated_response.json | jq '.'
else
    print_result 1 "Paginated commits retrieval failed (HTTP $http_code)"
fi

# Test 13: Error Handling - Non-existent Repository
echo
print_info "Testing error handling with non-existent repository..."
response=$(curl -s -w "%{http_code}" -o /tmp/error_response.json "$BASE_URL/repositories/non-existent-repo")
http_code=${response: -3}
if [ "$http_code" = "404" ]; then
    print_result 0 "Error handling works correctly (404 for non-existent repo)"
    cat /tmp/error_response.json | jq '.'
else
    print_result 1 "Error handling failed (expected 404, got $http_code)"
fi

# Test 14: Error Handling - Non-existent Commit
echo
print_info "Testing error handling with non-existent commit..."
fake_uuid="00000000-0000-0000-0000-000000000000"
response=$(curl -s -w "%{http_code}" -o /tmp/error_commit_response.json "$BASE_URL/repositories/$REPO_ID/commits/$fake_uuid")
http_code=${response: -3}
if [ "$http_code" = "404" ]; then
    print_result 0 "Error handling works correctly (404 for non-existent commit)"
    cat /tmp/error_commit_response.json | jq '.'
else
    print_result 1 "Error handling failed (expected 404, got $http_code)"
fi

echo
echo -e "${GREEN}🎉 All tests passed successfully!${NC}"
echo
echo "Test Summary:"
echo "- Repository ID: $REPO_ID"
echo "- First Commit ID: $COMMIT_ID"
echo "- Second Commit ID: $COMMIT_ID_2"
echo
echo "Cleanup: Remove /tmp/*_response.json and /tmp/commit_file_content if needed"