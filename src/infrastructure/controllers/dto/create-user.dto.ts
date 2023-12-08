import { IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Nome do usuário', minLength: 4, maxLength: 20 })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @ApiProperty({ description: 'Login do usuário', minLength: 4, maxLength: 20 })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  login: string;

  @ApiProperty({ description: 'Email do usuário' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Senha', minLength: 8 })
  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @ApiProperty({ description: 'Telefone do usuário' })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Status do usuário' })
  @IsNotEmpty()
  status: string;

  @ApiProperty({ description: 'Nome da mãe do usuário' })
  @IsNotEmpty()
  motherName: string;

  @ApiProperty({ description: 'Data de nascimento', type: Date })
  @IsNotEmpty()
  birth: Date;

  @ApiProperty({ description: 'CPF do usuário', minLength: 11 })
  @IsNotEmpty()
  @MinLength(11)
  cpf: string;
}
