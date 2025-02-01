import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from 'src/modules/user/dto/signup-user.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';


@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly mailService: MailService,
    ) { }

    async signup(signupDto: SignupDto): Promise<{ message: string; user: User; accessToken: string; refreshToken: string }> {
        const user = await this.userService.create(signupDto);

        const { accessToken, refreshToken } = await this.generateTokens(user);

        return {
            message: 'User registered successfully',
            user,
            accessToken,
            refreshToken
        };
    }

    async login(identifier: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
       const user = await this.userService.findByField(identifier);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        if(user.deletedAt)
        {
            throw new UnauthorizedException('User account has been deactivated');

        }
        return this.generateTokens(user);
    }

    private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
        const payload = { id: user.id };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '24h',
            secret: process.env.JWT_SECRET
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
            secret: process.env.REFRESH_TOKEN_SECRET
        });

        await this.userService.updateRefreshToken(user.id, refreshToken);
        return { accessToken, refreshToken };
    }


    async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
        try {
            const payload = this.jwtService.verify(refreshToken, { secret: process.env.REFRESH_TOKEN_SECRET });
            const user = await this.userService.findOneById(payload.id);

            if (!user || user.refreshToken !== refreshToken) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            return this.generateTokens(user);
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired refresh token');
        }
    }

    async logout(userId: string): Promise<void> {
        await this.userService.clearRefreshToken(userId);
    }

    async forgotPassword(email: string) {
        const user = await this.userService.findByField(email);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const token = this.jwtService.sign({ id: user.id }, {
            expiresIn: '1h',
            secret: process.env.PASS_RESET_SECRET
        });

        await this.mailService.sendResetPasswordEmail(email, token);

        return { message: 'Password reset link sent to your email' };
    }

    async resetPassword(token: string, newPassword: string) {
        try {

            const decoded = this.jwtService.verify(token, { secret: process.env.PASS_RESET_SECRET });

            const user = await this.userService.findOneById(decoded.id);
            if (!user) {
                throw new NotFoundException('User not found');
            }
            await this.userService.updatePassword(user.id, newPassword);

            return { message: 'Password successfully reset' };
        } catch (error) {
            throw new BadRequestException('Invalid or expired token');
        }
    }
    
}
