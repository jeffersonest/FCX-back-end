// src/infrastructure/modules/auth.module.ts

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthPort } from '../../core/ports/auth.port';
import { AuthAdapter } from '../adapters/auth.adapter';
import { AuthController } from '../controllers/auth.controller';
import { JwtStrategy } from '../auth/jwt.strategy';
import { AuthService } from '../../core/usecases/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../core/entities/user.entity';
import { MailModule } from './mail.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60m' },
    }),
    MailModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthPort,
      useClass: AuthAdapter,
    },
    AuthService,
    JwtStrategy,
  ],
  exports: [AuthPort],
})
export class AuthModule {}
