import { IsDate, IsMongoId, IsOptional, IsString } from 'class-validator';

export class EditEmployeeLeaveDto {
  @IsMongoId()
  @IsOptional()
  leaveTypeId?: string;

  @IsString()
  @IsOptional()
  startDate?: Date;

  @IsString()
  @IsOptional()
  endDate?: Date;

  @IsString()
  @IsOptional()
  reason: string;

  @IsMongoId()
  @IsOptional()
  updatedBy?: string;
}
