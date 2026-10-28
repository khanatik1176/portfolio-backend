import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service.js';
import { SectionsService } from './sections/sections.service.js';
import { SettingsService } from './settings/settings.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly settings: SettingsService,
    private readonly sections: SectionsService,
  ) {}

  @Get('health')
  async health() {
    await this.prisma.$queryRaw`SELECT 1`;
    return { status: 'ok', database: 'up' };
  }

  /** Everything the public site needs in one request. */
  @Get('portfolio')
  async portfolio() {
    const [settings, sections] = await Promise.all([
      this.settings.get(),
      this.sections.findPublic(),
    ]);
    return { settings, sections };
  }
}
