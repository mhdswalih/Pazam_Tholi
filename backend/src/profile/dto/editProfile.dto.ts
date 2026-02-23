import { IsOptional, IsString } from 'class-validator';

export class EditProfileDto {

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  profilePic?: string;

}