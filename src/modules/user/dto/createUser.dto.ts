import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  contactNo: string;

  @IsMongoId()
  roleId: string;

  @IsMongoId()
  @IsOptional()
  departmentId?: string;

  @IsMongoId()
  @IsOptional()
  designationId?: string;

  @IsMongoId()
  companyId: string;

  @IsString()
  @IsOptional()
  gender?: String;

  @IsString()
  @IsOptional()
  dob?: Date;

  @IsString()
  @IsOptional()
  dateOfJoining?: Date;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  profilePic?: string;

  @IsMongoId()
  @IsOptional()
  createdBy?: string;
}
