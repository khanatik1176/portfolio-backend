import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMessageDto } from './dto/create-message.dto.js';
import { MailService } from './mail.service.js';

@Injectable()
export class MessagesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  /** Saves the message, then emails it to the owner (saving never depends on email). */
  async create(dto: CreateMessageDto) {
    const saved = await this.prisma.contactMessage.create({
      data: dto,
      select: { id: true, createdAt: true },
    });
    const emailed = await this.mail.notifyOwner(dto);
    return { ...saved, emailed };
  }

  findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  setRead(id: string, isRead: boolean) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { isRead },
    });
  }

  remove(id: string) {
    return this.prisma.contactMessage.delete({ where: { id } });
  }
}
