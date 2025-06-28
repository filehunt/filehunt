import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { Message } from '@aws-sdk/client-sqs';
import { SqsService } from './sqs.service';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationWorkerService
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(NotificationWorkerService.name);
  private isRunning = false;
  private pollingInterval: NodeJS.Timeout | null = null;

  constructor(
    private readonly sqsService: SqsService,
    private readonly notificationService: NotificationService,
  ) {}

  async onModuleInit() {
    this.logger.log('Notification Worker starting...');
    await this.startPolling();
  }

  onModuleDestroy() {
    this.logger.log('Notification Worker stopping...');
    this.stopPolling();
  }

  private async startPolling(): Promise<void> {
    this.isRunning = true;
    this.logger.log('Starting SQS polling for notifications queue');
    await this.pollMessages();
  }

  private stopPolling(): void {
    this.isRunning = false;
    if (this.pollingInterval) {
      clearTimeout(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  private async pollMessages(): Promise<void> {
    while (this.isRunning) {
      try {
        const messages = await this.sqsService.receiveMessages();

        if (messages.length > 0) {
          this.logger.log(
            `Received ${messages.length} message(s) from notifications queue`,
          );

          for (const message of messages) {
            await this.processMessage(message);
          }
        }

        // Continue polling immediately if running
        if (this.isRunning) {
          await this.pollMessages();
        }
      } catch (error) {
        this.logger.error('Error during SQS polling', error);

        // Wait before retrying on error
        if (this.isRunning) {
          await this.sleep(5000);
          if (this.isRunning) {
            await this.pollMessages();
          }
        }
      }
    }
  }

  private async processMessage(message: Message): Promise<void> {
    try {
      this.logger.debug(
        `Processing message: ${message.MessageId ?? 'unknown'}`,
      );

      const event = this.sqsService.parseMessage(message);
      if (!event) {
        this.logger.warn(
          `Failed to parse message: ${message.MessageId ?? 'unknown'}`,
        );
        // Delete invalid message to prevent reprocessing
        if (message.ReceiptHandle) {
          await this.sqsService.deleteMessage(message.ReceiptHandle);
        }
        return;
      }

      // Send notification
      await this.notificationService.sendNotification(event);

      // Delete message after successful processing
      if (message.ReceiptHandle) {
        await this.sqsService.deleteMessage(message.ReceiptHandle);
      }

      this.logger.log(
        `Successfully processed message: ${message.MessageId ?? 'unknown'}`,
      );
    } catch (error) {
      this.logger.error(
        `Error processing message: ${message.MessageId ?? 'unknown'}`,
        error,
      );
      // Message will be retried automatically due to SQS visibility timeout
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
