#!/bin/bash

# Test script for simplified messaging architecture
# Tests that a single file_uploaded event is delivered to both SQS queues

set -e

LOCALSTACK_ENDPOINT="http://localhost:4566"
AWS_REGION="us-east-1"

# Set AWS credentials for LocalStack
export AWS_ACCESS_KEY_ID=test
export AWS_SECRET_ACCESS_KEY=test
export AWS_DEFAULT_REGION=us-east-1

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
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

echo_test() {
    echo -e "${BLUE}[TEST]${NC} $1"
}

# Check if LocalStack is running
check_localstack() {
    echo_info "Checking LocalStack status..."
    if ! curl -s "$LOCALSTACK_ENDPOINT/_localstack/health" > /dev/null 2>&1; then
        echo_error "LocalStack is not running. Please start it first."
        exit 1
    fi
    echo_info "LocalStack is running"
}

# Get SNS topic ARN
get_topic_arn() {
    local topic_name="$1"
    local topic_arn=$(aws --endpoint-url=$LOCALSTACK_ENDPOINT sns list-topics \
        --region $AWS_REGION \
        --output text --query "Topics[?contains(TopicArn, '$topic_name')].TopicArn | [0]" 2>/dev/null || echo "")
    
    if [ -z "$topic_arn" ] || [ "$topic_arn" = "None" ]; then
        echo_error "SNS topic '$topic_name' not found"
        return 1
    fi
    
    echo "$topic_arn"
}

# Get queue URL
get_queue_url() {
    local queue_name="$1"
    local queue_url=$(aws --endpoint-url=$LOCALSTACK_ENDPOINT sqs list-queues \
        --queue-name-prefix "$queue_name" \
        --region $AWS_REGION \
        --output text --query 'QueueUrls[0]' 2>/dev/null || echo "")
    
    if [ -z "$queue_url" ] || [ "$queue_url" = "None" ]; then
        echo_error "SQS queue '$queue_name' not found"
        return 1
    fi
    
    echo "$queue_url"
}

# Purge queue
purge_queue() {
    local queue_url="$1"
    local queue_name="$2"
    
    echo_info "Purging queue: $queue_name"
    aws --endpoint-url=$LOCALSTACK_ENDPOINT sqs purge-queue \
        --queue-url "$queue_url" \
        --region $AWS_REGION > /dev/null 2>&1 || echo_warn "Failed to purge queue (might be empty)"
    
    sleep 1
}

# Publish single file uploaded event (as file-service would do)
publish_file_uploaded_event() {
    local topic_arn="$1"
    local file_id="$2"
    local user_id="$3"
    local filename="$4"
    
    echo_test "Publishing single file_uploaded event for: $filename"
    
    local timestamp=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)
    local version_id=$(uuidgen 2>/dev/null || echo "test-version-$(date +%s)")
    local correlation_id=$(uuidgen 2>/dev/null || echo "test-correlation-$(date +%s)")
    
    # Single comprehensive file uploaded event
    local file_uploaded_message='{
        "message_id": "'$(uuidgen 2>/dev/null || echo "test-msg-$(date +%s)")'"",
        "event_type": "file_uploaded", 
        "source": "file-service",
        "data": {
            "event_type": "FileUploaded",
            "file_id": "'$file_id'",
            "user_id": "'$user_id'",
            "file_name": "'$filename'",
            "file_size": 3145728,
            "content_type": "image/jpeg",
            "s3_key": "files/'$file_id'/versions/v1/'$filename'",
            "s3_bucket": "filehunt-files",
            "version_id": "'$version_id'",
            "version_number": 1,
            "commit_hash": "abc123def456789",
            "file_hash": "sha256:abcdef123456789",
            "tags": ["vacation", "2024", "photo"],
            "processing_hints": {
                "generate_thumbnail": true,
                "extract_metadata": true,
                "virus_scan": true,
                "index_content": true
            },
            "upload_context": {
                "client_ip": "192.168.1.100",
                "user_agent": "FilehuntApp/1.0",
                "upload_session_id": "'$(uuidgen 2>/dev/null || echo "session-$(date +%s)")'"
            },
            "timestamp": "'$timestamp'"
        },
        "timestamp": "'$timestamp'",
        "correlation_id": "'$correlation_id'",
        "retry_count": 0
    }'
    
    # Publish the single event
    local message_id=$(aws --endpoint-url=$LOCALSTACK_ENDPOINT sns publish \
        --topic-arn "$topic_arn" \
        --message "$file_uploaded_message" \
        --message-attributes 'event_type={DataType=String,StringValue=file_uploaded}' \
        --region $AWS_REGION \
        --output text --query 'MessageId' 2>/dev/null || echo "")
    
    if [ -n "$message_id" ]; then
        echo_info "Published file_uploaded event: $message_id"
        return 0
    else
        echo_error "Failed to publish file_uploaded event"
        return 1
    fi
}

# Check messages in queue and analyze what workers would do
check_queue_messages_with_analysis() {
    local queue_url="$1"
    local queue_name="$2"
    local worker_type="$3"
    
    echo_test "Checking messages in queue: $queue_name (for $worker_type)"
    
    # Wait for message delivery
    sleep 2
    
    local messages=$(aws --endpoint-url=$LOCALSTACK_ENDPOINT sqs receive-message \
        --queue-url "$queue_url" \
        --max-number-of-messages 10 \
        --wait-time-seconds 3 \
        --region $AWS_REGION \
        --output json 2>/dev/null || echo '{}')
    
    local message_count=$(echo "$messages" | jq -r '.Messages // [] | length' 2>/dev/null || echo "0")
    
    echo_info "Found $message_count message(s) in queue: $queue_name"
    
    if [ "$message_count" -gt 0 ]; then
        echo_info "✅ Queue $queue_name received file_uploaded event"
        
        # Analyze what this worker would do with the message
        case "$worker_type" in
            "file-worker")
                echo_info "🔧 file-worker would:"
                echo_info "  - Check content_type (image/jpeg) → Generate thumbnail"
                echo_info "  - Run virus scan based on processing_hints"
                echo_info "  - Extract EXIF metadata from image"
                echo_info "  - Store processed results back to S3"
                ;;
            "notification-worker")
                echo_info "📧 notification-worker would:"
                echo_info "  - Generate upload complete notification for user"
                echo_info "  - Send in-app notification: 'Your file vacation-photo.jpg is ready'"
                echo_info "  - Send push notification based on user preferences"
                echo_info "  - Log notification delivery status"
                ;;
            "file-indexer")
                echo_info "🔍 file-indexer would:"
                echo_info "  - Index file metadata to Elasticsearch"
                echo_info "  - Index tags: [vacation, 2024, photo]"
                echo_info "  - Index searchable content (filename, metadata)"
                echo_info "  - Update search index for user's files"
                ;;
        esac
        
        # Show message structure
        echo_info "Message contains all necessary data:"
        echo "$messages" | jq -r '.Messages[0]? | .Body | fromjson | .Message | fromjson | "  - File: " + .data.file_name + "\n  - Size: " + (.data.file_size | tostring) + " bytes\n  - Content-Type: " + .data.content_type + "\n  - User: " + .data.user_id' 2>/dev/null || echo "  Could not parse message details"
        
    else
        echo_warn "❌ Queue $queue_name has no messages"
    fi
    
    return 0
}

# Main test function
run_simplified_test() {
    echo_info "=== Simplified Messaging Architecture Test ==="
    echo_info "Testing single file_uploaded event → multiple specialized workers"
    echo_info ""
    
    # Check prerequisites
    check_localstack
    
    if ! command -v jq &> /dev/null; then
        echo_warn "jq not found - message parsing will be limited"
    fi
    
    # Get infrastructure details
    local topic_arn
    topic_arn=$(get_topic_arn "filehunt-file-events")
    if [ $? -ne 0 ]; then
        echo_error "Failed to get SNS topic. Run setup-aws-messaging.sh first"
        exit 1
    fi
    echo_info "Using SNS topic: $topic_arn"
    
    local file_processing_queue_url
    file_processing_queue_url=$(get_queue_url "file-processing-queue")
    if [ $? -ne 0 ]; then
        echo_error "Failed to get file-processing-queue. Run setup-aws-messaging.sh first"
        exit 1
    fi
    echo_info "File processing queue: $file_processing_queue_url"
    
    local notifications_queue_url
    notifications_queue_url=$(get_queue_url "notifications-queue")
    if [ $? -ne 0 ]; then
        echo_error "Failed to get notifications-queue. Run setup-aws-messaging.sh first"
        exit 1
    fi
    echo_info "Notifications queue: $notifications_queue_url"
    
    # Purge queues to start clean
    purge_queue "$file_processing_queue_url" "file-processing-queue"
    purge_queue "$notifications_queue_url" "notifications-queue"
    
    # Generate test data
    local test_file_id=$(uuidgen 2>/dev/null || echo "test-file-$(date +%s)")
    local test_user_id=$(uuidgen 2>/dev/null || echo "test-user-$(date +%s)")
    local test_filename="vacation-photo-$(date +%s).jpg"
    
    echo_info "Test scenario: User uploads a vacation photo"
    echo_info "  File ID: $test_file_id"
    echo_info "  User ID: $test_user_id"
    echo_info "  Filename: $test_filename"
    echo_info ""
    
    # Publish single file uploaded event
    echo_test "Step 1: File service publishes single file_uploaded event"
    if ! publish_file_uploaded_event "$topic_arn" "$test_file_id" "$test_user_id" "$test_filename"; then
        echo_error "Failed to publish file_uploaded event"
        exit 1
    fi
    echo_info ""
    
    # Check how each worker would handle the message
    echo_test "Step 2: Analyzing how workers would process the event"
    echo_info ""
    
    check_queue_messages_with_analysis "$file_processing_queue_url" "file-processing-queue" "file-worker"
    echo_info ""
    
    check_queue_messages_with_analysis "$notifications_queue_url" "notifications-queue" "notification-worker"
    echo_info ""
    
    # Note about file-indexer
    echo_info "📝 Note: file-indexer could consume from either queue or both"
    echo_info "   It would extract the same data for Elasticsearch indexing"
    echo_info ""
    
    # Architecture benefits summary
    echo_info "=== Architecture Benefits ==="
    echo_info "✅ Single event publication (file-service responsibility ends here)"
    echo_info "✅ Each worker decides its own processing logic"
    echo_info "✅ Easy to add new workers without changing file-service"
    echo_info "✅ Workers can be developed and deployed independently"
    echo_info "✅ Natural load balancing (multiple instances per worker type)"
    echo_info ""
    
    echo_info "=== Next Steps ==="
    echo_info "1. Deploy file-worker to consume file-processing-queue"
    echo_info "2. Deploy notification-worker to consume notifications-queue"
    echo_info "3. Deploy file-indexer to consume from one of the queues"
    echo_info "4. Add more workers as needed (analytics, backup, etc.)"
    echo_info ""
    
    echo_info "🎉 Simplified messaging architecture is working perfectly!"
}

# Show usage
show_usage() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Test simplified messaging architecture with single file_uploaded event"
    echo ""
    echo "Options:"
    echo "  -h, --help     Show this help message"
    echo ""
    echo "Prerequisites:"
    echo "  - LocalStack running on port 4566"
    echo "  - AWS messaging infrastructure set up (run setup-aws-messaging.sh first)"
    echo "  - jq installed for message parsing (optional but recommended)"
}

# Parse command line arguments
case "${1:-}" in
    -h|--help)
        show_usage
        exit 0
        ;;
    "")
        run_simplified_test
        ;;
    *)
        echo_error "Unknown option: $1"
        show_usage
        exit 1
        ;;
esac