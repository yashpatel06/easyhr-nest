import { IsMongoId, IsString } from 'class-validator';

export class EditDesignationDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsMongoId()
  roleId: string;

  @IsMongoId()
  departmentId: string;
}
