import { IsEmail, IsString } from 'class-validator';

export class EditUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  role: string;
}
