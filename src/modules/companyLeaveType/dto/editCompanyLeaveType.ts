import {
  IsBoolean,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditCompanyLeaveTypeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  leaveCount?: number;

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
  updatedBy?: string;
}
