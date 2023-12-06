import { Module } from '@nestjs/common';
import { MailPort } from '../../core/ports/mail.port';
import { MailAdapter } from '../adapters/mail.adapter';

@Module({
  imports: [],
  providers: [
    {
      provide: MailPort,
      useClass: MailAdapter,
    },
  ],
  exports: [MailPort],
})
export class MailModule {}
