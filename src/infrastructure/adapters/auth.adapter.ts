import { AuthPort } from '../../core/ports/auth.port';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../core/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RecoverAccessDto } from '../controllers/dto/recover-access.dto';
import { MailPort } from '../../core/ports/mail.port';

@Injectable()
export class AuthAdapter implements AuthPort {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private mailPort: MailPort,
  ) {}

  async validateUser(login: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findOneBy({ login });
    if (user && (await bcrypt.compare(password, user.password))) {
      delete user.password;
      return user;
    }
    return null;
  }

  async validateUserPayload(payload: any): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: payload.sub });
    if (!user) {
      throw new UnauthorizedException();
    }
    delete user.password;
    return user;
  }

  async recoverPassword(recoverAccessDto: RecoverAccessDto): Promise<any> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.email = :email', { email: recoverAccessDto.email })
      .andWhere('user.cpf = :cpf', { cpf: recoverAccessDto.cpf })
      .getOne();

    if (!user) {
      throw new UnauthorizedException();
    } else {
      const newPassword = Math.random().toString(36).slice(-8);
      const saltRounds = 10;
      const password = await bcrypt.hash(newPassword, saltRounds);
      await this.userRepository.update(user.id, { password: password });

      this.mailPort.sendMail({
        subject: 'Recuperação de senha',
        email: user.email,
        template: 'recover',
        data: { newPassword },
      });
    }

    return HttpStatus.OK;
  }
}
