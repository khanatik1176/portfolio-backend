import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AuthModule } from './auth/auth.module.js';
import { MessagesModule } from './messages/messages.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { RevalidateModule } from './revalidate/revalidate.module.js';
import { SectionsModule } from './sections/sections.module.js';
import { SettingsModule } from './settings/settings.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    RevalidateModule,
    AuthModule,
    SettingsModule,
    SectionsModule,
    MessagesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
