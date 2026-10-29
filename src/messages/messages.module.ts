import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller.js';
import { MailService } from './mail.service.js';
import { MessagesService } from './messages.service.js';

@Module({
  controllers: [MessagesController],
  providers: [MessagesService, MailService],
})
export class MessagesModule {}
