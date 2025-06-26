#!/bin/bash

# Test script for file-service API
set -e

BASE_URL="http://localhost:3001"
TEST_FILE="test-file.txt"
FILE_CONTENT="This is a test file for file-service"

echo "Testing File Service API..."

# Health check
echo "1. Testing health check..."
curl -s "$BASE_URL/health" | jq '.'

# Readiness check
echo "2. Testing readiness check..."
curl -s "$BASE_URL/ready" | jq '.'

# Create test file
echo "$FILE_CONTENT" > "$TEST_FILE"

# Prepare upload
echo "3. Preparing file upload..."
PREPARE_RESPONSE=$(curl -s -X POST "$BASE_URL/files/prepare" \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "test-file.txt",
    "content_type": "text/plain",
    "file_size": '$(wc -c < "$TEST_FILE")',
    "tags": {"test": true, "environment": "development"}
  }')

echo "Prepare response:"
echo "$PREPARE_RESPONSE" | jq '.'

# Extract file_id and presigned_url
FILE_ID=$(echo "$PREPARE_RESPONSE" | jq -r '.file_id')
PRESIGNED_URL=$(echo "$PREPARE_RESPONSE" | jq -r '.presigned_url')

echo "File ID: $FILE_ID"

# Upload file to S3 using presigned URL
echo "4. Uploading file to S3..."
UPLOAD_RESPONSE=$(curl -s -X PUT "$PRESIGNED_URL" \
  -H "Content-Type: text/plain" \
  --data-binary "@$TEST_FILE")

echo "Upload completed"

# Complete upload
echo "5. Completing upload..."
COMPLETE_RESPONSE=$(curl -s -X POST "$BASE_URL/files/complete" \
  -H "Content-Type: application/json" \
  -d '{
    "file_id": "'$FILE_ID'",
    "etag": "test-etag"
  }')

echo "Complete response:"
echo "$COMPLETE_RESPONSE" | jq '.'

# Get file information
echo "6. Getting file information..."
curl -s "$BASE_URL/files/$FILE_ID" | jq '.'

# List files
echo "7. Listing files..."
curl -s "$BASE_URL/files?limit=5" | jq '.'

# Get file stats
echo "8. Getting file statistics..."
curl -s "$BASE_URL/stats" | jq '.'

# Cleanup
rm -f "$TEST_FILE"

echo "File service test completed successfully!"