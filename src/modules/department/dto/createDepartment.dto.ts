import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsMongoId()
  @IsOptional()
  createdBy: string;
}
