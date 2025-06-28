import { Injectable, Logger } from '@nestjs/common';
import { FileUploadedEvent } from './sqs.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async sendNotification(event: FileUploadedEvent): Promise<void> {
    try {
      const { user_id, file_name, file_id } = event.data;

      // For now, we'll just log to console
      // Later this can be extended to send emails, push notifications, etc.
      this.logger.log(
        `Sending notification to user ${user_id}: Your file ${file_name} is ready`,
      );

      // Simulate some processing time
      await this.sleep(100);

      this.logger.log(`Notification sent successfully for file ${file_id}`);
    } catch (error) {
      this.logger.error('Error sending notification', error);
      throw error;
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
