import { IsMongoId, IsOptional, IsString } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;

  @IsMongoId()
  @IsOptional()
  createdBy: string;
}
