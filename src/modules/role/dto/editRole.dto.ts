import { IsString } from 'class-validator';

export class EditRoleDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;
}
