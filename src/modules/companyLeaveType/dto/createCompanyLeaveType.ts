import {
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateCompanyLeaveTypeDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsString()
  description: string;

  @IsNumber()
  leaveCount: number;

  @IsMongoId()
  @IsOptional()
  leaveTypeMasterId?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @IsBoolean()
  @IsOptional()
  isCarryForword?: boolean;

  @IsBoolean()
  @IsOptional()
  isCahsable?: boolean;

  @IsBoolean()
  @IsOptional()
  isRequiredProof?: boolean;

  @IsMongoId()
  @IsOptional()
  companyId?: string;

  @IsMongoId()
  @IsOptional()
  createdBy?: string;
}
