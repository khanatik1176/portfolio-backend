import { ArrayNotEmpty, IsArray, IsString } from 'class-validator';

/** IDs in their new display order. */
export class ReorderDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ids: string[];
}
