import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMessageDto {
  @IsString() @MaxLength(120) name: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() @MaxLength(200) subject?: string;
  @IsString() @MaxLength(5000) message: string;
}
