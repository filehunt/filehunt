import { Test, TestingModule } from '@nestjs/testing';
import {
  SqsService,
  FileUploadedEvent,
  SQSNotificationMessage,
} from './sqs.service';
import { Message } from '@aws-sdk/client-sqs';

// Mock AWS SDK
jest.mock('@aws-sdk/client-sqs', () => {
  const mockSend = jest.fn();
  return {
    SQSClient: jest.fn().mockImplementation(() => ({
      send: mockSend,
    })),
    ReceiveMessageCommand: jest.fn(),
    DeleteMessageCommand: jest.fn(),
    Message: jest.fn(),
  };
});

describe('SqsService', () => {
  let service: SqsService;
  let mockSQSClient: jest.Mocked<any>;

  beforeEach(async () => {
    // Clear all mocks
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [SqsService],
    }).compile();

    service = module.get<SqsService>(SqsService);
    mockSQSClient = service['sqsClient'] as jest.Mocked<any>;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('receiveMessages', () => {
    it('should receive messages successfully', async () => {
      const mockMessages: Message[] = [
        {
          MessageId: 'msg-1',
          Body: JSON.stringify({
            Type: 'Notification',
            Message: JSON.stringify({
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
            }),
          }),
          ReceiptHandle: 'receipt-123',
        },
      ];

      mockSQSClient.send.mockResolvedValue({ Messages: mockMessages });

      const result = await service.receiveMessages();

      expect(result).toEqual(mockMessages);
      expect(mockSQSClient.send).toHaveBeenCalledTimes(1);
    });

    it('should return empty array when no messages', async () => {
      mockSQSClient.send.mockResolvedValue({ Messages: undefined });

      const result = await service.receiveMessages();

      expect(result).toEqual([]);
    });

    it('should throw error when SQS fails', async () => {
      const error = new Error('SQS connection failed');
      mockSQSClient.send.mockRejectedValue(error);

      await expect(service.receiveMessages()).rejects.toThrow(
        'SQS connection failed',
      );
    });
  });

  describe('deleteMessage', () => {
    it('should delete message successfully', async () => {
      mockSQSClient.send.mockResolvedValue({});

      await service.deleteMessage('receipt-handle-123');

      expect(mockSQSClient.send).toHaveBeenCalledTimes(1);
    });

    it('should throw error when delete fails', async () => {
      const error = new Error('Delete failed');
      mockSQSClient.send.mockRejectedValue(error);

      await expect(service.deleteMessage('receipt-handle-123')).rejects.toThrow(
        'Delete failed',
      );
    });
  });

  describe('parseMessage', () => {
    it('should parse valid file_uploaded message', () => {
      const fileEvent: FileUploadedEvent = {
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

      const snsMessage: SQSNotificationMessage = {
        Type: 'Notification',
        Message: JSON.stringify(fileEvent),
        MessageAttributes: {
          event_type: {
            Value: 'file_uploaded',
          },
        },
      };

      const message: Message = {
        MessageId: 'msg-1',
        Body: JSON.stringify(snsMessage),
        ReceiptHandle: 'receipt-123',
      };

      const result = service.parseMessage(message);

      expect(result).toEqual(fileEvent);
    });

    it('should return null for empty body', () => {
      const message: Message = {
        MessageId: 'msg-1',
        Body: undefined,
        ReceiptHandle: 'receipt-123',
      };

      const logSpy = jest.spyOn(service['logger'], 'warn');
      const result = service.parseMessage(message);

      expect(result).toBeNull();
      expect(logSpy).toHaveBeenCalledWith('Message body is empty');
    });

    it('should return null for non-notification message', () => {
      const snsMessage = {
        Type: 'SubscriptionConfirmation',
        Message: 'test',
      };

      const message: Message = {
        MessageId: 'msg-1',
        Body: JSON.stringify(snsMessage),
        ReceiptHandle: 'receipt-123',
      };

      const logSpy = jest.spyOn(service['logger'], 'warn');
      const result = service.parseMessage(message);

      expect(result).toBeNull();
      expect(logSpy).toHaveBeenCalledWith('Message is not a notification type');
    });

    it('should return null for unsupported event type', () => {
      const fileEvent = {
        event_type: 'file_deleted',
        data: {},
      };

      const snsMessage: SQSNotificationMessage = {
        Type: 'Notification',
        Message: JSON.stringify(fileEvent),
      };

      const message: Message = {
        MessageId: 'msg-1',
        Body: JSON.stringify(snsMessage),
        ReceiptHandle: 'receipt-123',
      };

      const logSpy = jest.spyOn(service['logger'], 'warn');
      const result = service.parseMessage(message);

      expect(result).toBeNull();
      expect(logSpy).toHaveBeenCalledWith(
        'Unsupported event type: file_deleted',
      );
    });

    it('should return null for invalid JSON', () => {
      const message: Message = {
        MessageId: 'msg-1',
        Body: 'invalid json',
        ReceiptHandle: 'receipt-123',
      };

      const logSpy = jest.spyOn(service['logger'], 'error');
      const result = service.parseMessage(message);

      expect(result).toBeNull();
      expect(logSpy).toHaveBeenCalledWith(
        'Error parsing message',
        expect.any(Error),
      );
    });

    it('should handle different file types', () => {
      const testCases = [
        {
          file_name: 'image.jpg',
          content_type: 'image/jpeg',
        },
        {
          file_name: 'video.mp4',
          content_type: 'video/mp4',
        },
        {
          file_name: 'archive.zip',
          content_type: 'application/zip',
        },
      ];

      testCases.forEach((testCase) => {
        const fileEvent: FileUploadedEvent = {
          event_type: 'file_uploaded',
          data: {
            file_id: 'file-123',
            user_id: 'user-456',
            file_name: testCase.file_name,
            file_size: 1024,
            content_type: testCase.content_type,
            upload_path: `/uploads/${testCase.file_name}`,
            uploaded_at: '2024-01-01T12:00:00Z',
          },
        };

        const snsMessage: SQSNotificationMessage = {
          Type: 'Notification',
          Message: JSON.stringify(fileEvent),
        };

        const message: Message = {
          MessageId: 'msg-1',
          Body: JSON.stringify(snsMessage),
          ReceiptHandle: 'receipt-123',
        };

        const result = service.parseMessage(message);

        expect(result).toEqual(fileEvent);
        expect(result?.data.content_type).toBe(testCase.content_type);
        expect(result?.data.file_name).toBe(testCase.file_name);
      });
    });
  });
});
