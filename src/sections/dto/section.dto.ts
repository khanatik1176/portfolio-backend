import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { SectionType } from '../../generated/prisma/enums.js';

export class CreateSectionDto {
  @IsString()
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug must be lowercase kebab-case',
  })
  slug: string;

  @IsEnum(SectionType)
  type: SectionType;

  @IsString()
  title: string;

  @IsOptional() @IsString() subtitle?: string;
  @IsOptional() @IsObject() content?: Record<string, unknown>;
  @IsOptional() @IsInt() order?: number;
  @IsOptional() @IsBoolean() isVisible?: boolean;
}

export class UpdateSectionDto extends PartialType(CreateSectionDto) {}
