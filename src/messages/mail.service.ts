import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { type Transporter } from 'nodemailer';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateMessageDto } from './dto/create-message.dto.js';

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/**
 * Emails new contact messages to the site owner over SMTP.
 * Disabled (with a warning) when SMTP_* env vars are missing.
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter | null;

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    const host = config.get<string>('SMTP_HOST');
    const user = config.get<string>('SMTP_USER');
    const pass = config.get<string>('SMTP_PASS');
    if (!host || !user || !pass) {
      this.logger.warn('SMTP not configured: contact messages will be saved but not emailed');
      this.transporter = null;
      return;
    }
    const port = Number(config.get('SMTP_PORT', 465));
    this.transporter = nodemailer.createTransport({ host, port, secure: port === 465, auth: { user, pass } });
  }

  /** Sends the message to MAIL_TO (or the site's public email). Returns whether it was sent. */
  async notifyOwner(msg: CreateMessageDto): Promise<boolean> {
    if (!this.transporter) return false;

    const settings = await this.prisma.siteSettings.findUnique({ where: { id: 1 } });
    const to = this.config.get<string>('MAIL_TO') ?? settings?.email;
    if (!to) {
      this.logger.warn('No MAIL_TO or site email set: skipping contact email');
      return false;
    }

    const subject = msg.subject?.trim() || 'New message from your portfolio';
    try {
      await this.transporter.sendMail({
        from: this.config.get<string>('MAIL_FROM') ?? `"Portfolio" <${this.config.get<string>('SMTP_USER')}>`,
        to,
        replyTo: `"${msg.name.replace(/"/g, '')}" <${msg.email}>`,
        subject: `[Portfolio] ${subject}`,
        text: `From: ${msg.name} <${msg.email}>\nSubject: ${subject}\n\n${msg.message}`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:560px">
            <h2 style="margin:0 0 12px">New portfolio message</h2>
            <p style="margin:0"><b>From:</b> ${escapeHtml(msg.name)} &lt;${escapeHtml(msg.email)}&gt;</p>
            <p style="margin:4px 0 16px"><b>Subject:</b> ${escapeHtml(subject)}</p>
            <div style="white-space:pre-wrap;padding:12px 14px;border-left:3px solid #e5d800;background:#f6f4ff">${escapeHtml(msg.message)}</div>
            <p style="color:#888;font-size:12px;margin-top:16px">Reply to this email to answer ${escapeHtml(msg.name)} directly.</p>
          </div>`,
      });
      return true;
    } catch (err) {
      this.logger.error(`Failed to email contact message: ${(err as Error).message}`);
      return false;
    }
  }
}
