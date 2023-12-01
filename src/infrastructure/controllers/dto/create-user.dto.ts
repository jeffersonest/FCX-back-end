import { IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  name: string;

  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(20)
  login: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;

  @IsNotEmpty()
  phone: string;

  @IsNotEmpty()
  status: string;

  @IsNotEmpty()
  motherName: string;

  @IsNotEmpty()
  birth: Date;

  @IsNotEmpty()
  @MinLength(11)
  cpf: string;
}
