import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class EditDesignationDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsMongoId()
  departmentId: string;

  @IsMongoId()
  @IsOptional()
  updatedBy: string;
}
