import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateLeaveTypeDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsString()
  description: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @IsMongoId()
  @IsOptional()
  companyId?: string;

  @IsMongoId()
  @IsOptional()
  createdBy?: string;
}
