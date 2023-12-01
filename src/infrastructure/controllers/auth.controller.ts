import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../core/usecases/auth.service';
import { LoginDto } from './dto/login.dto';

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
}
