import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SqsService } from './sqs.service';
import { NotificationService } from './notification.service';
import { NotificationWorkerService } from './notification-worker.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [
    AppService,
    SqsService,
    NotificationService,
    NotificationWorkerService,
  ],
})
export class AppModule {}
