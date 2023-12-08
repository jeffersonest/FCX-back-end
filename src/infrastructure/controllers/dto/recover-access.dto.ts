import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RecoverAccessDto {
  @ApiProperty({ description: 'Email do usuário' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'CPF do usuário', minLength: 11 })
  @IsNotEmpty()
  @MinLength(11)
  cpf: string;

  @IsOptional()
  newPassword: string;
}
