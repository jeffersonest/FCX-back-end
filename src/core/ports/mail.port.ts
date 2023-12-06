import { SendMailDto } from '../../infrastructure/controllers/dto/send-mail.dto';

export abstract class MailPort {
  abstract sendMail(data: SendMailDto): Promise<any>;
}
