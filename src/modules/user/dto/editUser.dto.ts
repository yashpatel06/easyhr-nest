import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditUserDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  contactNo: string;

  @IsMongoId()
  roleId: string;

  @IsMongoId()
  departmentId: string;

  @IsMongoId()
  designationId: string;

  @IsString()
  @IsOptional()
  gender: String;

  @IsString()
  @IsOptional()
  dob: Date;

  @IsString()
  @IsOptional()
  dateOfJoining: Date;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  profilePic: string;

  @IsMongoId()
  @IsOptional()
  updatedBy: string;
}
