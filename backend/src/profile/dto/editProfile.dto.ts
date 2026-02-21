import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EditProfileDto {

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional()
  @IsString()
  profilePic?: string;

}