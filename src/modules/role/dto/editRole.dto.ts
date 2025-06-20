import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsOptional,
  IsString,
} from 'class-validator';

export class EditRoleDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsString()
  roleType: string;

  @IsBoolean()
  @IsOptional()
  isDefault: boolean;

  @IsArray()
  @IsMongoId({ each: true })
  permissionIds: string[];

  @IsMongoId()
  companyId: string;

  @IsMongoId()
  @IsOptional()
  updatedBy: string;
}
