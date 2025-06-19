import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
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
  @IsOptional()
  companyId: string;

  @IsMongoId()
  @IsOptional()
  createdBy: string;
}
