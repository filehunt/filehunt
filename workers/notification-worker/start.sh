#!/bin/bash

# Set environment variables for LocalStack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1
export SQS_ENDPOINT=http://localhost:4566
export QUEUE_URL_NOTIFICATIONS=http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/notifications-queue
export LOG_LEVEL=debug

echo "Starting Notification Worker..."
echo "Queue URL: $QUEUE_URL_NOTIFICATIONS"

npm run start:dev