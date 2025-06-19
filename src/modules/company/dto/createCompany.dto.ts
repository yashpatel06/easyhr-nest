import { IsEmail, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateCompanyDto {
  @IsString()
  name: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  contactNo: string;

  @IsString()
  alternateContactNo: string;

  @IsString()
  ownerName: string;

  @IsString()
  contactPerson: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  pincode: string;

  @IsString()
  @IsOptional()
  companyLogo: string;

  @IsMongoId()
  @IsOptional()
  createdBy: string;
}
