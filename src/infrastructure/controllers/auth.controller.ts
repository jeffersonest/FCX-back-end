import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../../core/usecases/auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto);
    if (user) {
      return this.authService.login(user);
    }
    throw new UnauthorizedException();
  }

  @Get('validate')
  @UseGuards(JwtAuthGuard)
  async validateUserToken(@Req() request: any): Promise<any> {
    return request.user;
  }
}
