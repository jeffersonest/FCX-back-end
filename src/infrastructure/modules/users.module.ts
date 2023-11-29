// src/infrastructure/modules/users.module.ts
import { Module } from '@nestjs/common';
import { UsersAdapter } from '../adapters/users.adapter';
import { UsersPort } from '../../core/ports/users.port';
import { UsersController } from '../controllers/users.controller';
import { UsersService } from '../../core/usecases/users.service';
import { User } from '../../core/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    {
      provide: UsersPort,
      useClass: UsersAdapter,
    },
    UsersService,
  ],
})
export class UsersModule {}
