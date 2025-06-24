import {
  IsArray,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  contactNo?: string;

  @IsString()
  @IsOptional()
  alternateContactNo?: string;

  @IsMongoId()
  @IsOptional()
  roleId?: string;

  @IsMongoId()
  @IsOptional()
  departmentId?: string;

  @IsMongoId()
  @IsOptional()
  designationId?: string;

  @IsMongoId()
  @IsOptional()
  companyId?: string;

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
  profilePicture?: string;

  @IsString()
  @IsOptional()
  userType?: string;

  @IsString()
  @IsOptional()
  currentAddress?: string;

  @IsString()
  @IsOptional()
  currentCity?: string;

  @IsString()
  @IsOptional()
  currentState?: string;

  @IsString()
  @IsOptional()
  currentPincode?: string;

  @IsString()
  @IsOptional()
  permanentAddress?: string;

  @IsString()
  @IsOptional()
  permanentCity?: string;

  @IsString()
  @IsOptional()
  permanentState?: string;

  @IsString()
  @IsOptional()
  permanentPincode?: string;

  @IsString()
  @IsOptional()
  aadharNumber?: string;

  @IsString()
  @IsOptional()
  panNumber?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  reportingManager?: string[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  projectManager?: string[];

  @IsMongoId()
  @IsOptional()
  updatedBy?: string;
}
