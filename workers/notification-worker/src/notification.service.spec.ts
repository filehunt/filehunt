import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { FileUploadedEvent } from './sqs.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationService],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendNotification', () => {
    it('should send notification successfully', async () => {
      const mockEvent: FileUploadedEvent = {
        event_type: 'file_uploaded',
        data: {
          file_id: 'test-file-123',
          user_id: 'user-456',
          file_name: 'test-document.pdf',
          file_size: 1024768,
          content_type: 'application/pdf',
          upload_path: '/uploads/test-document.pdf',
          uploaded_at: '2024-01-01T12:00:00Z',
        },
      };

      // Mock console.log to capture log output
      const logSpy = jest.spyOn(service['logger'], 'log');

      await service.sendNotification(mockEvent);

      expect(logSpy).toHaveBeenCalledWith(
        'Sending notification to user user-456: Your file test-document.pdf is ready',
      );
      expect(logSpy).toHaveBeenCalledWith(
        'Notification sent successfully for file test-file-123',
      );
    });

    it('should throw error when notification fails', async () => {
      const mockEvent: FileUploadedEvent = {
        event_type: 'file_uploaded',
        data: {
          file_id: 'test-file-123',
          user_id: 'user-456',
          file_name: 'test-document.pdf',
          file_size: 1024768,
          content_type: 'application/pdf',
          upload_path: '/uploads/test-document.pdf',
          uploaded_at: '2024-01-01T12:00:00Z',
        },
      };

      // Mock sleep to throw an error
      jest
        .spyOn(service, 'sleep' as keyof NotificationService)
        .mockRejectedValue(new Error('Network error'));
      const errorSpy = jest.spyOn(service['logger'], 'error');

      await expect(service.sendNotification(mockEvent)).rejects.toThrow(
        'Network error',
      );
      expect(errorSpy).toHaveBeenCalledWith(
        'Error sending notification',
        expect.any(Error),
      );
    });

    it('should handle different file types correctly', async () => {
      const testCases = [
        {
          file_name: 'image.jpg',
          content_type: 'image/jpeg',
          user_id: 'user-123',
          file_id: 'file-123',
        },
        {
          file_name: 'video.mp4',
          content_type: 'video/mp4',
          user_id: 'user-456',
          file_id: 'file-456',
        },
        {
          file_name: 'document.txt',
          content_type: 'text/plain',
          user_id: 'user-789',
          file_id: 'file-789',
        },
      ];

      const logSpy = jest.spyOn(service['logger'], 'log');

      for (const testCase of testCases) {
        const mockEvent: FileUploadedEvent = {
          event_type: 'file_uploaded',
          data: {
            file_id: testCase.file_id,
            user_id: testCase.user_id,
            file_name: testCase.file_name,
            file_size: 1024,
            content_type: testCase.content_type,
            upload_path: `/uploads/${testCase.file_name}`,
            uploaded_at: '2024-01-01T12:00:00Z',
          },
        };

        await service.sendNotification(mockEvent);

        expect(logSpy).toHaveBeenCalledWith(
          `Sending notification to user ${testCase.user_id}: Your file ${testCase.file_name} is ready`,
        );
        expect(logSpy).toHaveBeenCalledWith(
          `Notification sent successfully for file ${testCase.file_id}`,
        );
      }
    });
  });
});
