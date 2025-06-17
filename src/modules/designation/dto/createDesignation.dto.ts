import { IsMongoId, IsString } from 'class-validator';

export class CreateDesignationDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsMongoId()
  roleId: string;

  @IsMongoId()
  departmentId: string;
}
