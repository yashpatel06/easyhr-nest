import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateDesignationDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsMongoId()
  departmentId: string;

  @IsMongoId()
  @IsOptional()
  companyId?: string;

  @IsMongoId()
  @IsOptional()
  createdBy: string;
}
