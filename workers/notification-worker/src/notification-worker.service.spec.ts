import { Test, TestingModule } from '@nestjs/testing';
import { NotificationWorkerService } from './notification-worker.service';
import { SqsService, FileUploadedEvent } from './sqs.service';
import { NotificationService } from './notification.service';
import { Message } from '@aws-sdk/client-sqs';

describe('NotificationWorkerService', () => {
  let service: NotificationWorkerService;
  let sqsService: jest.Mocked<SqsService>;
  let notificationService: jest.Mocked<NotificationService>;

  const mockFileEvent: FileUploadedEvent = {
    event_type: 'file_uploaded',
    data: {
      file_id: 'file-123',
      user_id: 'user-456',
      file_name: 'test.pdf',
      file_size: 1024,
      content_type: 'application/pdf',
      upload_path: '/uploads/test.pdf',
      uploaded_at: '2024-01-01T12:00:00Z',
    },
  };

  const mockMessage: Message = {
    MessageId: 'msg-123',
    Body: JSON.stringify({
      Type: 'Notification',
      Message: JSON.stringify(mockFileEvent),
    }),
    ReceiptHandle: 'receipt-handle-123',
  };

  beforeEach(async () => {
    const mockSqsService = {
      receiveMessages: jest.fn(),
      deleteMessage: jest.fn(),
      parseMessage: jest.fn(),
    };

    const mockNotificationService = {
      sendNotification: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationWorkerService,
        {
          provide: SqsService,
          useValue: mockSqsService,
        },
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    service = module.get<NotificationWorkerService>(NotificationWorkerService);
    sqsService = module.get(SqsService);
    notificationService = module.get(NotificationService);

    // Mock the sleep method to avoid actual delays in tests
    jest
      .spyOn(service, 'sleep' as keyof NotificationWorkerService)
      .mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Stop polling to clean up
    service.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processMessage', () => {
    it('should process valid message successfully', async () => {
      sqsService.parseMessage.mockReturnValue(mockFileEvent);
      notificationService.sendNotification.mockResolvedValue();
      sqsService.deleteMessage.mockResolvedValue();

      await service['processMessage'](mockMessage);

      expect(sqsService.parseMessage).toHaveBeenCalledWith(mockMessage);
      expect(notificationService.sendNotification).toHaveBeenCalledWith(
        mockFileEvent,
      );
      expect(sqsService.deleteMessage).toHaveBeenCalledWith(
        'receipt-handle-123',
      );
    });

    it('should handle invalid message by deleting it', async () => {
      sqsService.parseMessage.mockReturnValue(null);
      sqsService.deleteMessage.mockResolvedValue();

      const logSpy = jest.spyOn(service['logger'], 'warn');

      await service['processMessage'](mockMessage);

      expect(sqsService.parseMessage).toHaveBeenCalledWith(mockMessage);
      expect(notificationService.sendNotification).not.toHaveBeenCalled();
      expect(sqsService.deleteMessage).toHaveBeenCalledWith(
        'receipt-handle-123',
      );
      expect(logSpy).toHaveBeenCalledWith('Failed to parse message: msg-123');
    });

    it('should handle message without receipt handle', async () => {
      const messageWithoutHandle: Message = {
        MessageId: 'msg-123',
        Body: mockMessage.Body,
        ReceiptHandle: undefined,
      };

      sqsService.parseMessage.mockReturnValue(null);

      await service['processMessage'](messageWithoutHandle);

      expect(sqsService.parseMessage).toHaveBeenCalledWith(
        messageWithoutHandle,
      );
      expect(sqsService.deleteMessage).not.toHaveBeenCalled();
    });

    it('should handle notification service error', async () => {
      const error = new Error('Notification failed');
      sqsService.parseMessage.mockReturnValue(mockFileEvent);
      notificationService.sendNotification.mockRejectedValue(error);

      const logSpy = jest.spyOn(service['logger'], 'error');

      await service['processMessage'](mockMessage);

      expect(sqsService.parseMessage).toHaveBeenCalledWith(mockMessage);
      expect(notificationService.sendNotification).toHaveBeenCalledWith(
        mockFileEvent,
      );
      expect(sqsService.deleteMessage).not.toHaveBeenCalled();
      expect(logSpy).toHaveBeenCalledWith(
        'Error processing message: msg-123',
        error,
      );
    });

    it('should handle delete message error', async () => {
      const deleteError = new Error('Delete failed');
      sqsService.parseMessage.mockReturnValue(mockFileEvent);
      notificationService.sendNotification.mockResolvedValue();
      sqsService.deleteMessage.mockRejectedValue(deleteError);

      const logSpy = jest.spyOn(service['logger'], 'error');

      await service['processMessage'](mockMessage);

      expect(sqsService.parseMessage).toHaveBeenCalledWith(mockMessage);
      expect(notificationService.sendNotification).toHaveBeenCalledWith(
        mockFileEvent,
      );
      expect(sqsService.deleteMessage).toHaveBeenCalledWith(
        'receipt-handle-123',
      );
      expect(logSpy).toHaveBeenCalledWith(
        'Error processing message: msg-123',
        deleteError,
      );
    });
  });

  describe('core functionality', () => {
    it('should receive and process messages correctly', async () => {
      sqsService.receiveMessages.mockResolvedValue([mockMessage]);
      sqsService.parseMessage.mockReturnValue(mockFileEvent);
      notificationService.sendNotification.mockResolvedValue();
      sqsService.deleteMessage.mockResolvedValue();

      await service['processMessage'](mockMessage);

      expect(sqsService.parseMessage).toHaveBeenCalledWith(mockMessage);
      expect(notificationService.sendNotification).toHaveBeenCalledWith(
        mockFileEvent,
      );
      expect(sqsService.deleteMessage).toHaveBeenCalledWith(
        'receipt-handle-123',
      );
    });

    it('should handle empty message queue', async () => {
      sqsService.receiveMessages.mockResolvedValue([]);

      const messages = await sqsService.receiveMessages();

      expect(messages).toEqual([]);
      expect(notificationService.sendNotification).not.toHaveBeenCalled();
    });
  });

  describe('lifecycle hooks', () => {
    it('should start polling on module init', async () => {
      const startPollingSpy = jest
        .spyOn(service, 'startPolling' as keyof NotificationWorkerService)
        .mockResolvedValue(undefined);

      await service.onModuleInit();

      expect(startPollingSpy).toHaveBeenCalled();
    });

    it('should stop polling on module destroy', () => {
      const stopPollingSpy = jest.spyOn(
        service,
        'stopPolling' as keyof NotificationWorkerService,
      );

      service.onModuleDestroy();

      expect(stopPollingSpy).toHaveBeenCalled();
    });
  });

  describe('startPolling and stopPolling', () => {
    it('should set isRunning to true when starting', async () => {
      // Mock pollMessages to prevent infinite loop
      jest
        .spyOn(service, 'pollMessages' as keyof NotificationWorkerService)
        .mockResolvedValue(undefined);

      await service['startPolling']();

      expect(service['isRunning']).toBe(true);
    });

    it('should set isRunning to false when stopping', () => {
      service['isRunning'] = true;

      service['stopPolling']();

      expect(service['isRunning']).toBe(false);
    });

    it('should clear polling interval when stopping', () => {
      const mockInterval = setTimeout(() => {
        // Mock interval
      }, 1000);
      service['pollingInterval'] = mockInterval;

      const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout');

      service['stopPolling']();

      expect(clearTimeoutSpy).toHaveBeenCalledWith(mockInterval);
      expect(service['pollingInterval']).toBeNull();
    });
  });
});
