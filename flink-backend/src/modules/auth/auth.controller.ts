import { Controller, Post, Body, UseGuards, Req, Query, Patch } from '@nestjs/common';
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

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(@Query('token') token: string, @Body('password') password: string) {
    return this.authService.resetPassword(token, password);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() req: any) {
    const userId = req.user.id;
    await this.authService.logout(userId);
    return { message: 'Logged out successfully' };
  }


  @Post('refreshtoken')
  async refreshToken(@Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(refreshToken);
  }

  @Post('restore')
  async restore(@Body('email') email: string) {
    return this.authService.restoreAccount(email);
  }

  @Post('restore-account')
  async restoreAccount(@Query('token') token: string) {
    return this.authService.handleRestoreAccount(token);
  }



}

