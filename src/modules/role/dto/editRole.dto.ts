import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class EditRoleDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsString()
  roleType: string;

  @IsArray()
  @IsMongoId({ each: true })
  permissionIds: string[];

  @IsMongoId()
  companyId: string;

  @IsMongoId()
  @IsOptional()
  updatedBy: string;
}
