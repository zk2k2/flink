import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/modules/user/dto/login-user.dto';
import { SignupDto } from 'src/modules/user/dto/signup-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(
      loginDto.identifier,
      loginDto.password,
    );

  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any) {
    console.log('request from auth controller', req.user);
    const userId = req.user.id;
    await this.authService.logout(userId);
    return { message: 'Logged out successfully' };
  }


  @Post('refreshtoken')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

}

