const AWS = require('aws-sdk');

// Configure AWS SDK for LocalStack
const sns = new AWS.SNS({
  endpoint: 'http://localhost:4566',
  region: 'us-east-1',
  accessKeyId: 'test',
  secretAccessKey: 'test'
});

const TOPIC_ARN = 'arn:aws:sns:us-east-1:000000000000:filehunt-file-events';

async function publishFileUploadEvent() {
  const event = {
    event_type: 'file_uploaded',
    data: {
      file_id: `file_${Date.now()}`,
      user_id: 'user_123',
      file_name: 'test-document.pdf',
      file_size: 1024768,
      content_type: 'application/pdf',
      upload_path: '/uploads/2024/01/test-document.pdf',
      uploaded_at: new Date().toISOString()
    }
  };

  const params = {
    TopicArn: TOPIC_ARN,
    Message: JSON.stringify(event),
    MessageAttributes: {
      event_type: {
        DataType: 'String',
        StringValue: 'file_uploaded'
      }
    }
  };

  try {
    console.log('Publishing file upload event...');
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const result = await sns.publish(params).promise();
    console.log('Event published successfully!');
    console.log('MessageId:', result.MessageId);
  } catch (error) {
    console.error('Error publishing event:', error);
  }
}

// Test different file types
async function testDifferentFileTypes() {
  const testFiles = [
    {
      file_name: 'image.jpg',
      content_type: 'image/jpeg',
      file_size: 2048000
    },
    {
      file_name: 'video.mp4',
      content_type: 'video/mp4',
      file_size: 52428800
    },
    {
      file_name: 'document.pdf',
      content_type: 'application/pdf',
      file_size: 1024768
    },
    {
      file_name: 'archive.zip',
      content_type: 'application/zip',
      file_size: 10485760
    }
  ];

  for (const file of testFiles) {
    const event = {
      event_type: 'file_uploaded',
      data: {
        file_id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: 'user_123',
        file_name: file.file_name,
        file_size: file.file_size,
        content_type: file.content_type,
        upload_path: `/uploads/2024/01/${file.file_name}`,
        uploaded_at: new Date().toISOString()
      }
    };

    const params = {
      TopicArn: TOPIC_ARN,
      Message: JSON.stringify(event),
      MessageAttributes: {
        event_type: {
          DataType: 'String',
          StringValue: 'file_uploaded'
        }
      }
    };

    try {
      console.log(`\nPublishing ${file.content_type} file event...`);
      const result = await sns.publish(params).promise();
      console.log(`✅ Published: ${file.file_name} (${result.MessageId})`);
    } catch (error) {
      console.error(`❌ Error publishing ${file.file_name}:`, error.message);
    }

    // Wait a bit between messages
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--multiple')) {
    console.log('Testing multiple file types...');
    await testDifferentFileTypes();
  } else {
    await publishFileUploadEvent();
  }
}

main().catch(console.error);