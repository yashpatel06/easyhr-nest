import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';

export class EditLeaveTypeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @IsMongoId()
  @IsOptional()
  companyId?: string;

  @IsMongoId()
  @IsOptional()
  updatedBy?: string;
}
