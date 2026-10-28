import { IsObject, IsOptional, IsString } from 'class-validator';
import type { Prisma } from '../../generated/prisma/client.js';

export class UpdateSettingsDto {
  @IsOptional() @IsString() siteName?: string;
  @IsOptional() @IsString() ownerName?: string;
  @IsOptional() @IsString() headline?: string;
  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsString() avatarUrl?: string;
  @IsOptional() @IsString() resumeUrl?: string;
  @IsOptional() @IsString() email?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() socials?: { platform: string; url: string }[];
  @IsOptional() @IsObject() seo?: Prisma.InputJsonObject;
  @IsOptional() @IsObject() theme?: Prisma.InputJsonObject;
}
