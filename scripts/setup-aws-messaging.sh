#!/bin/bash

# AWS LocalStack Setup Script for Messaging Infrastructure
# This script sets up SNS topics, SQS queues, and their subscriptions

set -e

LOCALSTACK_ENDPOINT="http://localhost:4566"
AWS_REGION="us-east-1"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

echo_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

echo_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Wait for LocalStack to be ready
wait_for_localstack() {
    echo_info "Waiting for LocalStack to be ready..."
    max_attempts=30
    attempt=0
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s "$LOCALSTACK_ENDPOINT/_localstack/health" > /dev/null 2>&1; then
            echo_info "LocalStack is ready!"
            return 0
        fi
        
        attempt=$((attempt + 1))
        echo_info "Attempt $attempt/$max_attempts - LocalStack not ready yet, waiting..."
        sleep 2
    done
    
    echo_error "LocalStack failed to start after $max_attempts attempts"
    return 1
}

# Create SNS topic
create_sns_topic() {
    local topic_name="$1"
    echo_info "Creating SNS topic: $topic_name"
    
    local topic_arn=$(aws --endpoint-url=$LOCALSTACK_ENDPOINT sns create-topic \
        --name "$topic_name" \
        --region $AWS_REGION \
        --output text --query 'TopicArn' 2>/dev/null || echo "")
    
    if [ -z "$topic_arn" ]; then
        # Try to get existing topic ARN
        topic_arn=$(aws --endpoint-url=$LOCALSTACK_ENDPOINT sns list-topics \
            --region $AWS_REGION \
            --output text --query "Topics[?contains(@, '$topic_name')].TopicArn | [0]" 2>/dev/null || echo "")
    fi
    
    if [ -n "$topic_arn" ]; then
        echo_info "SNS topic created/exists: $topic_arn"
        echo "$topic_arn"
    else
        echo_error "Failed to create SNS topic: $topic_name"
        return 1
    fi
}

# Create SQS queue
create_sqs_queue() {
    local queue_name="$1"
    local is_fifo="$2"
    
    echo_info "Creating SQS queue: $queue_name"
    
    local attributes=""
    if [ "$is_fifo" = "true" ]; then
        attributes="FifoQueue=true,ContentBasedDeduplication=true"
    fi
    
    local queue_url
    if [ -n "$attributes" ]; then
        queue_url=$(aws --endpoint-url=$LOCALSTACK_ENDPOINT sqs create-queue \
            --queue-name "$queue_name" \
            --attributes "$attributes" \
            --region $AWS_REGION \
            --output text --query 'QueueUrl' 2>/dev/null || echo "")
    else
        queue_url=$(aws --endpoint-url=$LOCALSTACK_ENDPOINT sqs create-queue \
            --queue-name "$queue_name" \
            --region $AWS_REGION \
            --output text --query 'QueueUrl' 2>/dev/null || echo "")
    fi
    
    if [ -z "$queue_url" ]; then
        # Try to get existing queue URL
        queue_url=$(aws --endpoint-url=$LOCALSTACK_ENDPOINT sqs list-queues \
            --queue-name-prefix "$queue_name" \
            --region $AWS_REGION \
            --output text --query 'QueueUrls[0]' 2>/dev/null || echo "")
    fi
    
    if [ -n "$queue_url" ]; then
        echo_info "SQS queue created/exists: $queue_url"
        echo "$queue_url"
    else
        echo_error "Failed to create SQS queue: $queue_name"
        return 1
    fi
}

# Get queue ARN from URL
get_queue_arn() {
    local queue_url="$1"
    
    local queue_arn=$(aws --endpoint-url=$LOCALSTACK_ENDPOINT sqs get-queue-attributes \
        --queue-url "$queue_url" \
        --attribute-names QueueArn \
        --region $AWS_REGION \
        --output text --query 'Attributes.QueueArn' 2>/dev/null || echo "")
    
    echo "$queue_arn"
}

# Subscribe SQS queue to SNS topic
subscribe_queue_to_topic() {
    local topic_arn="$1"
    local queue_arn="$2"
    local filter_policy="$3"
    
    echo_info "Subscribing queue to topic..."
    echo_info "  Topic ARN: $topic_arn"
    echo_info "  Queue ARN: $queue_arn"
    
    local subscription_arn
    if [ -n "$filter_policy" ]; then
        subscription_arn=$(aws --endpoint-url=$LOCALSTACK_ENDPOINT sns subscribe \
            --topic-arn "$topic_arn" \
            --protocol sqs \
            --notification-endpoint "$queue_arn" \
            --attributes "{\"FilterPolicy\":\"$filter_policy\"}" \
            --region $AWS_REGION \
            --output text --query 'SubscriptionArn' 2>/dev/null || echo "")
    else
        subscription_arn=$(aws --endpoint-url=$LOCALSTACK_ENDPOINT sns subscribe \
            --topic-arn "$topic_arn" \
            --protocol sqs \
            --notification-endpoint "$queue_arn" \
            --region $AWS_REGION \
            --output text --query 'SubscriptionArn' 2>/dev/null || echo "")
    fi
    
    if [ -n "$subscription_arn" ]; then
        echo_info "Subscription created: $subscription_arn"
        
        # Set queue policy to allow SNS to send messages
        local queue_url=$(echo "$queue_arn" | sed 's|.*:||')
        local queue_url="$LOCALSTACK_ENDPOINT/000000000000/$queue_url"
        
        local policy="{
            \"Version\": \"2012-10-17\",
            \"Statement\": [{
                \"Effect\": \"Allow\",
                \"Principal\": {\"Service\": \"sns.amazonaws.com\"},
                \"Action\": \"sqs:SendMessage\",
                \"Resource\": \"$queue_arn\",
                \"Condition\": {
                    \"ArnEquals\": {
                        \"aws:SourceArn\": \"$topic_arn\"
                    }
                }
            }]
        }"
        
        aws --endpoint-url=$LOCALSTACK_ENDPOINT sqs set-queue-attributes \
            --queue-url "$queue_url" \
            --attributes "Policy=$policy" \
            --region $AWS_REGION > /dev/null 2>&1 || echo_warn "Failed to set queue policy"
        
        return 0
    else
        echo_error "Failed to create subscription"
        return 1
    fi
}

# Create S3 buckets
create_s3_buckets() {
    echo_info "Creating S3 buckets..."
    
    local buckets=("filehunt-git" "filehunt-files" "filehunt-shared" "filehunt-processing")
    
    for bucket in "${buckets[@]}"; do
        aws --endpoint-url=$LOCALSTACK_ENDPOINT s3 mb "s3://$bucket" --region $AWS_REGION 2>/dev/null || echo_warn "Bucket $bucket already exists or failed to create"
        echo_info "Bucket ready: $bucket"
    done
}

# Create KMS key
create_kms_key() {
    echo_info "Creating KMS key..."
    
    local key_id=$(aws --endpoint-url=$LOCALSTACK_ENDPOINT kms create-key \
        --description "FilehuntFileEncryptionKey" \
        --usage ENCRYPT_DECRYPT \
        --region $AWS_REGION \
        --output text --query 'KeyMetadata.KeyId' 2>/dev/null || echo "")
    
    if [ -n "$key_id" ]; then
        # Create alias
        aws --endpoint-url=$LOCALSTACK_ENDPOINT kms create-alias \
            --alias-name "alias/filehunt-file-encryption" \
            --target-key-id "$key_id" \
            --region $AWS_REGION > /dev/null 2>&1 || echo_warn "Alias already exists or failed to create"
        
        echo_info "KMS key created: $key_id"
    else
        echo_warn "KMS key creation failed or already exists"
    fi
}

# Test message publishing
test_message_publishing() {
    local topic_arn="$1"
    
    echo_info "Testing message publishing to SNS topic..."
    
    local test_message='{
        "message_id": "test-123",
        "event_type": "file_uploaded",
        "source": "test-script",
        "data": {
            "event_type": "FileUploaded",
            "file_id": "test-file-id",
            "user_id": "test-user-id",
            "file_name": "test-file.txt",
            "file_size": 1024,
            "content_type": "text/plain",
            "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'"
        },
        "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)'",
        "correlation_id": "test-correlation-id",
        "retry_count": 0
    }'
    
    local message_id=$(aws --endpoint-url=$LOCALSTACK_ENDPOINT sns publish \
        --topic-arn "$topic_arn" \
        --message "$test_message" \
        --message-attributes 'event_type={DataType=String,StringValue=file_uploaded}' \
        --region $AWS_REGION \
        --output text --query 'MessageId' 2>/dev/null || echo "")
    
    if [ -n "$message_id" ]; then
        echo_info "Test message published successfully: $message_id"
        return 0
    else
        echo_error "Failed to publish test message"
        return 1
    fi
}

# Check messages in queues
check_queue_messages() {
    local queue_url="$1"
    local queue_name="$2"
    
    echo_info "Checking messages in queue: $queue_name"
    
    # Wait a moment for message delivery
    sleep 2
    
    local messages=$(aws --endpoint-url=$LOCALSTACK_ENDPOINT sqs receive-message \
        --queue-url "$queue_url" \
        --max-number-of-messages 10 \
        --region $AWS_REGION \
        --output json 2>/dev/null || echo '{}')
    
    local message_count=$(echo "$messages" | jq -r '.Messages // [] | length')
    
    if [ "$message_count" -gt 0 ]; then
        echo_info "Found $message_count message(s) in queue: $queue_name"
        
        # Delete messages to clean up
        echo "$messages" | jq -r '.Messages[]?.ReceiptHandle' | while read -r receipt_handle; do
            if [ -n "$receipt_handle" ] && [ "$receipt_handle" != "null" ]; then
                aws --endpoint-url=$LOCALSTACK_ENDPOINT sqs delete-message \
                    --queue-url "$queue_url" \
                    --receipt-handle "$receipt_handle" \
                    --region $AWS_REGION > /dev/null 2>&1 || echo_warn "Failed to delete message"
            fi
        done
        
    else
        echo_warn "No messages found in queue: $queue_name"
    fi
}

# Main setup function
main() {
    echo_info "Starting AWS messaging infrastructure setup..."
    
    # Wait for LocalStack
    if ! wait_for_localstack; then
        exit 1
    fi
    
    # Create S3 buckets
    create_s3_buckets
    
    # Create KMS key
    create_kms_key
    
    # Create SNS topic
    local topic_arn
    topic_arn=$(create_sns_topic "filehunt-file-events")
    if [ -z "$topic_arn" ]; then
        echo_error "Failed to create SNS topic"
        exit 1
    fi
    
    # Create SQS queues
    echo_info "Creating SQS queues..."
    
    # File processing queue (for file-worker)
    local file_processing_queue_url
    file_processing_queue_url=$(create_sqs_queue "file-processing-queue.fifo" "true")
    if [ -z "$file_processing_queue_url" ]; then
        echo_error "Failed to create file processing queue"
        exit 1
    fi
    
    # Notifications queue (for notification-worker)
    local notifications_queue_url
    notifications_queue_url=$(create_sqs_queue "notifications-queue.fifo" "true")
    if [ -z "$notifications_queue_url" ]; then
        echo_error "Failed to create notifications queue"
        exit 1
    fi
    

    
    # Get queue ARNs
    local file_processing_queue_arn
    file_processing_queue_arn=$(get_queue_arn "$file_processing_queue_url")
    
    local notifications_queue_arn
    notifications_queue_arn=$(get_queue_arn "$notifications_queue_url")
    

    
    # Subscribe queues to SNS topic - both listen to file_uploaded events
    echo_info "Setting up SNS subscriptions..."
    
    # File processing queue - subscribe to file_uploaded events for post-processing
    local file_processing_filter='{"event_type":["file_uploaded"]}'
    if ! subscribe_queue_to_topic "$topic_arn" "$file_processing_queue_arn" "$file_processing_filter"; then
        echo_error "Failed to subscribe file processing queue"
        exit 1
    fi
    
    # Notifications queue - subscribe to file_uploaded events for notifications
    local notifications_filter='{"event_type":["file_uploaded"]}'
    if ! subscribe_queue_to_topic "$topic_arn" "$notifications_queue_arn" "$notifications_filter"; then
        echo_error "Failed to subscribe notifications queue"
        exit 1
    fi
    

    
    # Test the setup
    echo_info "Testing the messaging setup..."
    
    if test_message_publishing "$topic_arn"; then
        # Check if messages arrived in queues
        check_queue_messages "$file_processing_queue_url" "file-processing-queue"
        check_queue_messages "$notifications_queue_url" "notifications-queue"

    fi
    
    # Display summary
    echo_info "=== Setup Summary ==="
    echo_info "SNS Topic ARN: $topic_arn"
    echo_info "File Processing Queue: $file_processing_queue_url"
    echo_info "Notifications Queue: $notifications_queue_url"

    echo_info "===================="
    
    echo_info "AWS messaging infrastructure setup completed successfully!"
}

# Run main function
main "$@"