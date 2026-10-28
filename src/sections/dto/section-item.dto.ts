import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSectionItemDto {
  @IsString()
  title: string;

  @IsOptional() @IsString() subtitle?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsString() link?: string;
  @IsOptional() @IsString({ each: true }) tags?: string[];
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() endDate?: string;
  @IsOptional() @IsObject() data?: Record<string, unknown>;
  @IsOptional() @IsInt() order?: number;
  @IsOptional() @IsBoolean() isVisible?: boolean;
}

export class UpdateSectionItemDto extends PartialType(CreateSectionItemDto) {}
