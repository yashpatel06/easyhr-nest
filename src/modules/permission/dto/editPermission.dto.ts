import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class EditPermissionDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsString()
  group: string;

  // @IsString()
  // permissionType: string;

  @IsMongoId()
  @IsOptional()
  updatedBy: string;
}
