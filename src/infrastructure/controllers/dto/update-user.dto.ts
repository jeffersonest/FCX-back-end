import {
  IsNotEmpty,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @IsOptional()
  @MinLength(4)
  @MaxLength(20)
  login: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @MinLength(8)
  password: string;

  @IsOptional()
  phone: string;

  @IsOptional()
  status: string;

  @IsOptional()
  motherName: string;

  @IsOptional()
  birth: Date;

  @IsOptional()
  @MinLength(11)
  cpf: string;
}
