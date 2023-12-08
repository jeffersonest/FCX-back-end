import { Transform } from 'class-transformer';
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserFilterDto {
  @ApiProperty({ description: 'Valor do filtro', required: false })
  @IsOptional()
  @IsString()
  filterValue: string;

  @ApiProperty({
    description: 'Tipo do filtro (por exemplo: nome, email)',
    required: false,
  })
  @IsOptional()
  @IsString()
  filterType: string;

  @ApiProperty({
    description: 'Faixa de idade (exemplo: "18>26 ou >40")',
    required: false,
  })
  @IsOptional()
  @IsString()
  ageRange: string;

  @ApiProperty({
    description: 'Usuário ativo ou não',
    required: false,
    type: Boolean,
  })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  userActive: boolean;

  @ApiProperty({
    description: 'Data de início para filtro de data de nascimento',
    type: Date,
    required: false,
  })
  @IsOptional()
  birthDateBegin: Date;

  @ApiProperty({
    description: 'Data de fim para filtro de data de nascimento',
    type: Date,
    required: false,
  })
  @IsOptional()
  birthDateEnd: Date;

  @ApiProperty({
    description: 'Data de início para filtro de data de registro',
    type: Date,
    required: false,
  })
  @IsOptional()
  registerDateBegin: Date;

  @ApiProperty({
    description: 'Data de fim para filtro de data de registro',
    type: Date,
    required: false,
  })
  @IsOptional()
  registerDateEnd: Date;

  @ApiProperty({
    description: 'Data de início para filtro de data de última atualização',
    type: Date,
    required: false,
  })
  @IsOptional()
  updateDateBegin: Date;

  @ApiProperty({
    description: 'Data de fim para filtro de data de última atualização',
    type: Date,
    required: false,
  })
  @IsOptional()
  updateDateEnd: Date;
}
