import { IsBoolean, IsMongoId, IsOptional, IsString } from 'class-validator';

export class EditLeaveTypeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @IsMongoId()
  @IsOptional()
  updatedBy?: string;
}
