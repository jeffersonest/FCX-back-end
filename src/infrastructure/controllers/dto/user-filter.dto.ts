import { Transform } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';

export class UserFilterDto {
  @IsOptional()
  @IsString()
  filterValue: string;

  @IsOptional()
  @IsString()
  filterType: string;

  @IsOptional()
  @IsString()
  ageRange: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  userActive: boolean;

  @IsOptional()
  birthDateBegin: Date;

  @IsOptional()
  birthDateEnd: Date;

  @IsOptional()
  registerDateBegin: Date;

  @IsOptional()
  registerDateEnd: Date;

  @IsOptional()
  updateDateBegin: Date;

  @IsOptional()
  updateDateEnd: Date;
}
