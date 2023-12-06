import { MailPort } from '../../core/ports/mail.port';
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailDto } from '../controllers/dto/send-mail.dto';

@Injectable()
export class MailAdapter implements MailPort {
  constructor(private readonly mailerService: MailerService) {}
  async sendMail(data: SendMailDto): Promise<any> {
    this.mailerService
      .sendMail({
        to: data.email,
        from: process.env.MAIL_USER,
        subject: data.subject,
        template: data.template,
        context: {
          password: data.data?.newPassword,
        },
      })
      .then(() => {
        console.log('Email sent');
        return 'Email sent';
      })
      .catch((error) => {
        console.log('Error sending email', error);
      });
  }
}
