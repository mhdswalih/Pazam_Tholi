import { IsString, IsOptional } from 'class-validator';

export class CreatePostDto {

  @IsString()
  caption: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  location?: string;
}