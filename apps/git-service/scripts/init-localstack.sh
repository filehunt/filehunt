#!/bin/bash

# LocalStack S3 Initialization Script
# This script sets up the S3 bucket and basic configuration for git-service

set -e

echo "🚀 Initializing LocalStack for Git Service"
echo "=========================================="

# Configuration
LOCALSTACK_ENDPOINT="http://localhost:4566"
BUCKET_NAME="git-service-bucket"
AWS_ACCESS_KEY_ID="test"
AWS_SECRET_ACCESS_KEY="test"
AWS_DEFAULT_REGION="us-east-1"

# Export AWS credentials for awscli
export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
export AWS_DEFAULT_REGION=$AWS_DEFAULT_REGION

echo "⏳ Waiting for LocalStack to be ready..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
    if aws --endpoint-url=$LOCALSTACK_ENDPOINT s3 ls > /dev/null 2>&1; then
        echo "✅ LocalStack is ready!"
        break
    fi
    
    if [ $attempt -eq $max_attempts ]; then
        echo "❌ LocalStack failed to start after $max_attempts attempts"
        exit 1
    fi
    
    echo "   Attempt $attempt/$max_attempts - waiting..."
    sleep 2
    ((attempt++))
done

echo "📦 Creating S3 bucket: $BUCKET_NAME"
if aws --endpoint-url=$LOCALSTACK_ENDPOINT s3 mb s3://$BUCKET_NAME 2>/dev/null; then
    echo "✅ Bucket created successfully"
else
    echo "ℹ️  Bucket already exists or creation failed, continuing..."
fi

echo "🔧 Setting up bucket configuration..."
# Enable versioning (optional, for future use)
aws --endpoint-url=$LOCALSTACK_ENDPOINT s3api put-bucket-versioning \
    --bucket $BUCKET_NAME \
    --versioning-configuration Status=Enabled 2>/dev/null || echo "⚠️  Versioning setup skipped"

# Set CORS configuration for web access (optional)
cat > /tmp/cors.json << EOF
{
    "CORSRules": [
        {
            "AllowedHeaders": ["*"],
            "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
            "AllowedOrigins": ["*"],
            "MaxAgeSeconds": 3600
        }
    ]
}
EOF

aws --endpoint-url=$LOCALSTACK_ENDPOINT s3api put-bucket-cors \
    --bucket $BUCKET_NAME \
    --cors-configuration file:///tmp/cors.json 2>/dev/null || echo "⚠️  CORS setup skipped"

rm -f /tmp/cors.json

echo "🧪 Testing bucket access..."
# Create a test object
echo "test-content-$(date)" | aws --endpoint-url=$LOCALSTACK_ENDPOINT s3 cp - s3://$BUCKET_NAME/health_check/test.txt

# List objects to verify
if aws --endpoint-url=$LOCALSTACK_ENDPOINT s3 ls s3://$BUCKET_NAME/health_check/ > /dev/null 2>&1; then
    echo "✅ Bucket access test successful"
    # Clean up test object
    aws --endpoint-url=$LOCALSTACK_ENDPOINT s3 rm s3://$BUCKET_NAME/health_check/test.txt > /dev/null 2>&1
else
    echo "❌ Bucket access test failed"
    exit 1
fi

echo "📋 LocalStack S3 Configuration Summary:"
echo "   Endpoint: $LOCALSTACK_ENDPOINT"
echo "   Bucket: $BUCKET_NAME"
echo "   Region: $AWS_DEFAULT_REGION"
echo "   Access Key: $AWS_ACCESS_KEY_ID"

echo ""
echo "🎉 LocalStack initialization complete!"
echo ""
echo "You can now start the git-service with:"
echo "   cd /path/to/git-service"
echo "   cargo run"
echo ""
echo "Or test the setup with:"
echo "   make test-api"