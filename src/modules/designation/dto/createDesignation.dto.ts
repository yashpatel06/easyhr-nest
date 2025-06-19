import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateDesignationDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsMongoId()
  companyId: string;

  @IsMongoId()
  departmentId: string;

  @IsMongoId()
  @IsOptional()
  createdBy: string;
}
