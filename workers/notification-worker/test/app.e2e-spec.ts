import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from './../src/app.module';
import { SqsService } from '../src/sqs.service';
import { NotificationService } from '../src/notification.service';
import { NotificationWorkerService } from '../src/notification-worker.service';
import { Message } from '@aws-sdk/client-sqs';

describe('NotificationWorker (e2e)', () => {
  let app: INestApplication;
  let sqsService: SqsService;
  let notificationService: NotificationService;
  let workerService: NotificationWorkerService;

  const mockFileEvent = {
    event_type: 'file_uploaded',
    data: {
      file_id: 'test-file-123',
      user_id: 'test-user-456',
      file_name: 'integration-test.pdf',
      file_size: 2048,
      content_type: 'application/pdf',
      upload_path: '/uploads/integration-test.pdf',
      uploaded_at: '2024-01-01T12:00:00Z',
    },
  };

  const mockSnsMessage = {
    Type: 'Notification',
    Message: JSON.stringify(mockFileEvent),
    MessageAttributes: {
      event_type: {
        Value: 'file_uploaded',
      },
    },
  };

  const mockSqsMessage: Message = {
    MessageId: 'e2e-test-message-123',
    Body: JSON.stringify(mockSnsMessage),
    ReceiptHandle: 'e2e-test-receipt-handle',
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(SqsService)
      .useValue({
        receiveMessages: jest.fn().mockResolvedValue([]),
        deleteMessage: jest.fn().mockResolvedValue(undefined),
        parseMessage: jest.fn(),
      })
      .compile();

    app = moduleFixture.createNestApplication();

    sqsService = moduleFixture.get<SqsService>(SqsService);
    notificationService =
      moduleFixture.get<NotificationService>(NotificationService);
    workerService = moduleFixture.get<NotificationWorkerService>(
      NotificationWorkerService,
    );

    // Prevent automatic polling for tests
    jest
      .spyOn(workerService, 'onModuleInit')
      .mockImplementation(async () => {});
    jest.spyOn(workerService, 'onModuleDestroy').mockImplementation(() => {});

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('SqsService Integration', () => {
    it('should parse SNS message correctly', () => {
      // Use the real parseMessage method for this test
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const SqsServiceClass = require('../src/sqs.service').SqsService;
      const realSqsService = new SqsServiceClass();
      const result = realSqsService.parseMessage(mockSqsMessage);

      expect(result).toEqual(mockFileEvent);
      expect(result?.event_type).toBe('file_uploaded');
      expect(result?.data.file_id).toBe('test-file-123');
    });

    it('should handle invalid SNS message', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const SqsServiceClass = require('../src/sqs.service').SqsService;
      const realSqsService = new SqsServiceClass();
      const invalidMessage: Message = {
        MessageId: 'invalid-msg',
        Body: 'invalid json content',
        ReceiptHandle: 'invalid-receipt',
      };

      const result = realSqsService.parseMessage(invalidMessage);
      expect(result).toBeNull();
    });
  });

  describe('NotificationService Integration', () => {
    it('should send notification for uploaded file', async () => {
      const logSpy = jest.spyOn(notificationService['logger'], 'log');

      await notificationService.sendNotification(mockFileEvent);

      expect(logSpy).toHaveBeenCalledWith(
        'Sending notification to user test-user-456: Your file integration-test.pdf is ready',
      );
    });
  });

  describe('Message Processing', () => {
    it('should process messages without polling', async () => {
      jest.spyOn(sqsService, 'parseMessage').mockReturnValue(mockFileEvent);
      jest.spyOn(sqsService, 'deleteMessage').mockResolvedValue();
      const sendNotificationSpy = jest.spyOn(
        notificationService,
        'sendNotification',
      );

      await workerService['processMessage'](mockSqsMessage);

      expect(sendNotificationSpy).toHaveBeenCalledWith(mockFileEvent);
      expect(sqsService.deleteMessage).toHaveBeenCalledWith(
        'e2e-test-receipt-handle',
      );
    });
  });

  describe('Environment Configuration', () => {
    it('should initialize services correctly', () => {
      expect(sqsService).toBeDefined();
      expect(notificationService).toBeDefined();
      expect(workerService).toBeDefined();
    });
  });
});
