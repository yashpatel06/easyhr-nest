import { IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateEmployeeLeaveDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsMongoId()
  companyLeaveTypeId?: string;

  @IsString()
  startDate?: Date;

  @IsString()
  endDate?: Date;

  @IsString()
  reason: string;

  @IsString()
  dayType: string;

  @IsString()
  @IsOptional()
  halfDayType?: string;

  @IsMongoId()
  @IsOptional()
  companyId?: string;

  @IsMongoId()
  @IsOptional()
  createdBy?: string;
}
