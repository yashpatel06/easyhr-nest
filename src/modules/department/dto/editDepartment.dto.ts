import { IsString } from 'class-validator';

export class EditDepartmentDto {
  @IsString()
  name: string;

  @IsString()
  displayName: string;
}
