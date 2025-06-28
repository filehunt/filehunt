import { Injectable, Logger } from '@nestjs/common';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  Message,
} from '@aws-sdk/client-sqs';

export interface FileUploadedEvent {
  event_type: string;
  data: {
    file_id: string;
    user_id: string;
    file_name: string;
    file_size: number;
    content_type: string;
    upload_path: string;
    uploaded_at: string;
  };
}

export interface SQSNotificationMessage {
  Type: string;
  Message: string;
  MessageAttributes?: {
    event_type?: {
      Value: string;
    };
  };
}

@Injectable()
export class SqsService {
  private readonly logger = new Logger(SqsService.name);
  private readonly sqsClient: SQSClient;
  private readonly queueUrl: string;

  constructor() {
    this.sqsClient = new SQSClient({
      region: process.env.AWS_DEFAULT_REGION || 'us-east-1',
      endpoint: process.env.SQS_ENDPOINT || 'http://localhost:4566',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
      },
    });

    this.queueUrl =
      process.env.QUEUE_URL_NOTIFICATIONS ||
      'http://sqs.us-east-1.localhost.localstack.cloud:4566/000000000000/notifications-queue';
  }

  async receiveMessages(): Promise<Message[]> {
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
        MessageAttributeNames: ['All'],
      });

      const response = await this.sqsClient.send(command);
      return response.Messages || [];
    } catch (error) {
      this.logger.error('Error receiving messages from SQS', error);
      throw error;
    }
  }

  async deleteMessage(receiptHandle: string): Promise<void> {
    try {
      const command = new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
      });

      await this.sqsClient.send(command);
      this.logger.debug('Message deleted successfully');
    } catch (error) {
      this.logger.error('Error deleting message from SQS', error);
      throw error;
    }
  }

  parseMessage(message: Message): FileUploadedEvent | null {
    try {
      if (!message.Body) {
        this.logger.warn('Message body is empty');
        return null;
      }

      const sqsMessage = JSON.parse(message.Body) as SQSNotificationMessage;

      if (sqsMessage.Type !== 'Notification') {
        this.logger.warn('Message is not a notification type');
        return null;
      }

      const eventData = JSON.parse(sqsMessage.Message) as FileUploadedEvent;

      if (eventData.event_type !== 'file_uploaded') {
        this.logger.warn(`Unsupported event type: ${eventData.event_type}`);
        return null;
      }

      return eventData;
    } catch (error) {
      this.logger.error('Error parsing message', error);
      return null;
    }
  }
}
