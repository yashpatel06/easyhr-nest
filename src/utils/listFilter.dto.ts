import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class ListFilterDto {
  @IsNumber()
  @Min(1)
  currentPage: number;

  @IsNumber()
  @Min(1)
  limit: number;

  @IsString()
  sortParam: string;

  @IsIn([1, -1], { message: 'sortOrder must be either 1 or -1' })
  sortOrder: 1 | -1;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsBoolean()
  isTemplate?: boolean;

  @IsOptional()
  @IsObject()
  filters?: any;

  [key: string]: any;
}

export class ManagePermissionDetailsDto {
  @IsOptional()
  @IsBoolean()
  isTemplate?: boolean;
}
