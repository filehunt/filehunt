# Quick Start - Git Service API Testing

## 🚀 Import & Test in 2 Minutes

### Step 1: Choose Your Tool

| Tool | Import File | Variables |
|------|-------------|-----------|
| **HTTPie Desktop** | `git_service.json` | Auto-configured |
| **Postman** | `git_service_postman.json` | Set `base_url` |
| **Insomnia** | `git_service_postman.json` | Set `base_url` |

### Step 2: Start Git Service

```bash
cd ../apps/git-service
make dev
```

Wait for: `✅ Git service listening on 0.0.0.0:3000`

### Step 3: Import Collection

**HTTPie Desktop:**
1. File → Import → Select `git_service.json`
2. Ready to test!

**Postman:**
1. Import → Select `git_service_postman.json`
2. Set variable `base_url` = `http://localhost:3000`
3. Ready to test!

### Step 4: Test Sequence

Execute in order:

1. **Health Check** ✅
2. **Create Repository** ✅
3. **Create First Commit** ✅
4. **List Commits** ✅

## 🎯 Essential Endpoints

| Action | Endpoint | Method |
|--------|----------|---------|
| Health | `/health` | GET |
| Create Repo | `/repositories` | POST |
| Create Commit | `/repositories/{id}/commits` | POST |
| List Commits | `/repositories/{id}/commits` | GET |

## 📝 Sample Data

**Repository:**
```json
{
  "name": "my-project",
  "owner": "developer",
  "description": "Test project"
}
```

**Commit:**
```json
{
  "message": "Initial commit",
  "author": "dev@example.com",
  "file_path": "/src/main.rs",
  "repository_id": "developer_my-project"
}
```

## ⚡ Automated Testing

```bash
# Run full test suite
./test_git_service.sh

# Quick smoke test
make smoke
```

## 🔧 Troubleshooting

**Service not responding?**
```bash
curl http://localhost:3000/health
```

**LocalStack issues?**
```bash
cd ../apps/git-service
make setup-localstack
```

**Collection import failed?**
- HTTPie: Use `git_service.json`
- Postman: Use `git_service_postman.json`
- Check JSON validity: `./validate_collections.sh`

## 📊 Expected Results

✅ Health Check → Status: "healthy"  
✅ Create Repo → Returns repository with ID  
✅ Create Commit → Returns commit with UUID  
✅ List Commits → Returns array with total count

## 🎉 You're Ready!

Import the collection, start the service, and begin testing the Git Service API immediately!