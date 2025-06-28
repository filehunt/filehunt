# End-to-End Testing

This folder contains end-to-end test collections for FileHunt microservices.

## Git Service - API Collections

### Available Formats

This folder contains **3 collection formats** to adapt to different tools:

1. **`git_service.json`** - HTTPie Desktop/Core format
2. **`git_service_core.json`** - Alternative HTTPie Core format  
3. **`git_service_postman.json`** - Postman/Insomnia format

### Prerequisites

1. **HTTPie Desktop**, **HTTPie CLI**, **Postman** or **Insomnia**
2. **Git Service** running on `http://localhost:3000`
3. **LocalStack** configured and operational

### Tool Installation

```bash
# HTTPie CLI
pip install httpie

# HTTPie Desktop
# Download from https://httpie.io/desktop

# Postman Desktop
# Download from https://www.postman.com/

# Insomnia
# Download from https://insomnia.rest/
```

### Using Collections

#### Option 1: HTTPie Desktop

1. Open HTTPie Desktop
2. Go to **File > Import**
3. Select `git_service.json` or `git_service_core.json`
4. The collection will be imported with all endpoints

#### Option 2: Postman

1. Open Postman
2. Click on **Import**
3. Select `git_service_postman.json`
4. Configure environment variables

#### Option 3: Insomnia

1. Open Insomnia
2. Go to **Application > Preferences > Data > Import Data**
3. Select `git_service_postman.json` (compatible)

#### Method 2: HTTPie CLI

```bash
# Example endpoint usage
cd filehunt/e2e

# Health check
http GET localhost:3000/health

# Create a repository
http POST localhost:3000/repositories \
  name="test-repo" \
  owner="testuser" \
  description="Test repository"

# Create a commit
http POST localhost:3000/repositories/testuser_test-repo/commits \
  message="Initial commit" \
  author="test@example.com" \
  file_path="/config/app.yaml" \
  repository_id="testuser_test-repo"

# List commits
http GET localhost:3000/repositories/testuser_test-repo/commits
```

### Collection Structure

The `git_service.json` collection contains:

#### 🔍 **Health Checks**
- `health_check` - Service status
- `readiness_check` - Readiness probe

#### 📁 **Repository Management**
- `create_repository` - Create a repository
- `list_repositories` - List all repositories
- `get_repository` - Repository details

#### 📝 **Commit Operations**
- `create_commit` - Create a commit
- `create_second_commit` - Second commit to test history
- `list_commits` - List commits
- `list_commits_paginated` - Commit pagination
- `get_commit` - Commit details
- `get_commit_details` - Full details with metadata
- `get_commit_file` - Download file

#### 🚫 **Error Handling**
- `error_nonexistent_repo` - Non-existent repository
- `error_nonexistent_commit` - Non-existent commit
- `create_invalid_repo` - Invalid data

#### 🏭 **Production Scenarios**
- `create_production_repo` - Production repository
- `create_hotfix_commit` - Urgent fix commit

### Test Scenarios

#### 1. **Complete Workflow**
End-to-end workflow:
1. Health checks
2. Repository creation
3. Commit creation
4. Listing and pagination

#### 2. **Error Handling**
Error handling tests:
1. Non-existent repository (404)
2. Non-existent commit (404)
3. Invalid data (400)

#### 3. **Production Simulation**
Production environment simulation:
1. Production repository
2. Hotfix commit
3. State verification

### Environment Variables

```json
{
  "base_url": "http://localhost:3000",
  "test_repo_id": "testuser_test-repo",
  "prod_repo_id": "devops_production-app"
}
```

### Important Notes

⚠️ **Before starting:**
- Start git-service: `cd apps/git-service && make dev`
- Check LocalStack: `docker ps | grep localstack`

📋 **Recommended execution order:**
1. Health checks first
2. Create repository before commits
3. Replace `COMMIT_ID_HERE` with actual IDs

🔧 **Customization:**
- Modify `base_url` if service runs on different port
- Adapt test data according to your needs
- Add your own scenarios

### Automation

To automate tests:

```bash
# Automated test script
#!/bin/bash
BASE_URL="http://localhost:3000"

echo "🔍 Health Check..."
http GET $BASE_URL/health

echo "📁 Creating Repository..."
REPO_RESPONSE=$(http POST $BASE_URL/repositories \
  name="auto-test" \
  owner="automation" \
  description="Automated test repository")

echo "📝 Creating Commit..."
COMMIT_RESPONSE=$(http POST $BASE_URL/repositories/automation_auto-test/commits \
  message="Automated commit" \
  author="automation@test.com" \
  file_path="/test/auto.txt" \
  repository_id="automation_auto-test")

echo "✅ Tests completed!"
```

### Troubleshooting

#### Service unavailable
```bash
# Check if service is running
curl http://localhost:3000/health

# Restart if necessary
cd apps/git-service && make dev
```

#### S3/LocalStack errors
```bash
# Check LocalStack
docker logs git-service-localstack

# Recreate bucket
./apps/git-service/scripts/init-localstack.sh
```

#### Missing commit IDs
1. Execute `create_commit` first
2. Copy the returned ID
3. Replace `COMMIT_ID_HERE` in other requests

This collection allows you to test the git-service API completely in an interactive and reproducible way! 🚀
