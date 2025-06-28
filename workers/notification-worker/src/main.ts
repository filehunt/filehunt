import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('NotificationWorker');

  try {
    logger.log('Starting Notification Worker...');

    const app = await NestFactory.createApplicationContext(AppModule);

    // Gracefully shutdown on SIGINT and SIGTERM
    process.on('SIGINT', () => {
      void (async () => {
        logger.log('Received SIGINT, shutting down gracefully...');
        await app.close();
        process.exit(0);
      })();
    });

    process.on('SIGTERM', () => {
      void (async () => {
        logger.log('Received SIGTERM, shutting down gracefully...');
        await app.close();
        process.exit(0);
      })();
    });

    logger.log('Notification Worker started successfully');

    // Keep the process alive
    setInterval(() => {
      // Keep alive check
    }, 30000);

    // Wait indefinitely
    await new Promise<void>((resolve) => {
      // Process will be terminated by signals, never resolve
      process.on('exit', () => resolve());
    });
  } catch (error) {
    logger.error('Failed to start Notification Worker', error);
    process.exit(1);
  }
}

void bootstrap();
