import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreatePermissionDto {
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
  createdBy: string;
}
