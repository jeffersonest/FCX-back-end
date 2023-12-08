import { IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Login do usuário', minLength: 4, maxLength: 20 })
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  login: string;

  @ApiProperty({ description: 'Senha', minLength: 8 })
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
