import { IsNotEmpty, IsOptional } from 'class-validator';

export class RecoverAccessDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  cpf: string;

  @IsOptional()
  newPassword: string;
}
