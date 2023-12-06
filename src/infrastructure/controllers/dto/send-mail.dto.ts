import { IsNotEmpty } from 'class-validator';

export class SendMailDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  template: string;

  data: any;
}
