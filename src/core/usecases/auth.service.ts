import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthPort } from '../ports/auth.port';
import { JwtService } from '@nestjs/jwt';
import { User } from '../entities/user.entity';
import { LoginDto } from '../../infrastructure/controllers/dto/login.dto';
import { RecoverAccessDto } from '../../infrastructure/controllers/dto/recover-access.dto';
import { MailPort } from '../ports/mail.port';

@Injectable()
export class AuthService {
  constructor(
    private authPort: AuthPort,
    private mailPort: MailPort,
    private jwtService: JwtService,
  ) {}

  async validateUser({ login, password }: LoginDto): Promise<User> {
    return this.authPort.validateUser(login, password);
  }

  async login(user: User): Promise<any> {
    const payload = { login: user.login, id: user.id };

    if (payload && payload.login && user.status.toString() == 'true') {
      return {
        user,
        access_token: this.jwtService.sign(payload, {
          expiresIn: '59m',
          secret: process.env.JWT_SECRET,
        }),
      };
    } else {
      throw new UnauthorizedException();
    }
  }

  async recoverPassword(recoverAccessDto: RecoverAccessDto): Promise<any> {
    return this.authPort.recoverPassword(recoverAccessDto);
  }
}
