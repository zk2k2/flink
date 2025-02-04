import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/modules/user/dto/login-user.dto';
import { SignupDto } from 'src/modules/user/dto/signup-user.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() signupDto: SignupDto, @Res() res: Response) {
    return await this.authService.signup(signupDto, res);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    return await this.authService.login(loginDto, res);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Query('token') token: string,
    @Body('password') password: string,
  ) {
    return this.authService.resetPassword(token, password);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Req() request: Request, @Res() res: Response) {
    await this.authService.logout(res);
    return { message: 'Logged out successfully' };
  }

  @Post('refreshtoken')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    return this.authService.refreshToken(req, res);
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
