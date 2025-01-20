import { Controller, Post, Body, UseGuards, Req, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from 'src/modules/user/dto/login-user.dto';
import { SignupDto } from 'src/modules/user/dto/signup-user.dto';
import { UserService } from 'src/modules/user/user.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,
        private readonly userService: UserService,
    ) { }

    @Post('signup')
    async signup(@Body() signupDto: SignupDto) {
        try {
            const newUser = await this.userService.create(signupDto);

            const token = await this.authService.login(newUser);

            return {
                message: 'User signed up and logged in successfully',
                token,
            };
        } catch (error) {
            throw new BadRequestException(error.message || 'Failed to signup');
        }
    }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateUser(
            loginDto.identifier,
            loginDto.password,
        );
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }

    @Post('refresh-token')
    @UseGuards(JwtAuthGuard)
    async refreshToken(@Req() req) {
        return this.authService.refreshToken(req.user);
    }
}
