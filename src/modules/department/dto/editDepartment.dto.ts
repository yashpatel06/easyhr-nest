import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class EditDepartmentDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsMongoId()
  @IsOptional()
  updatedBy: string;
}
