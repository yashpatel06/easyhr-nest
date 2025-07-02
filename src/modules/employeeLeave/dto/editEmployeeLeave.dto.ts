import { IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';

export class EditEmployeeLeaveDto {
  @IsMongoId()
  @IsOptional()
  companyLeaveTypeId?: string;

  @IsString()
  @IsOptional()
  startDate?: Date;

  @IsString()
  @IsOptional()
  endDate?: Date;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString()
  @IsOptional()
  dayType?: string;

  @IsString()
  @IsOptional()
  halfDayType?: string;

  @IsMongoId()
  @IsOptional()
  updatedBy?: string;
}
