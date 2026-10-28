import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/** Tells the Next.js frontend to drop its cached portfolio data after an admin edit. */
@Injectable()
export class RevalidateService {
  private readonly logger = new Logger(RevalidateService.name);

  constructor(private readonly config: ConfigService) {}

  async portfolio() {
    const frontendUrl = this.config.get<string>('FRONTEND_URL');
    const secret = this.config.get<string>('REVALIDATE_SECRET');
    if (!frontendUrl || !secret) return;

    try {
      const res = await fetch(`${frontendUrl}/api/revalidate`, {
        method: 'POST',
        headers: { 'x-revalidate-secret': secret },
      });
      if (!res.ok) this.logger.warn(`Revalidate failed: ${res.status}`);
    } catch (err) {
      this.logger.warn(`Revalidate unreachable: ${(err as Error).message}`);
    }
  }
}
