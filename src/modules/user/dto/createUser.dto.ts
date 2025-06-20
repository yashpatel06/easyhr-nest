import {
  IsArray,
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

  @IsString()
  alternateContactNo?: string;

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
  createdBy?: string;
}
