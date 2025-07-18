import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName?: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsString()
  @IsOptional()
  employeeId?: string;

  @IsString()
  contactNo: string;

  @IsString()
  @IsOptional()
  alternateContactNo?: string;

  @IsMongoId()
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
  bloodGroup?: String;

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

  @IsString()
  @IsOptional()
  emergnacyContactName?: string;

  @IsString()
  @IsOptional()
  emergnacyContactNumber?: string;

  @IsString()
  @IsOptional()
  bankName?: string;

  @IsString()
  @IsOptional()
  bankAccountNumber?: string;

  @IsString()
  @IsOptional()
  bankIfscCode?: string;

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  reportingManager?: string[];

  @IsArray()
  @IsMongoId({ each: true })
  @IsOptional()
  projectManager?: string[];

  @IsBoolean()
  @IsOptional()
  isAdmin?: boolean;

  @IsMongoId()
  @IsOptional()
  createdBy?: string;
}
