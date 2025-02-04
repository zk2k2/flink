import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from 'src/modules/user/dto/signup-user.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { Response } from 'express';
import { LoginDto } from '../user/dto/login-user.dto';
import { Request } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly mailService: MailService,
    ) { }

    async signup(signupDto: SignupDto,res:Response): Promise<Response> {
        
        const user = await this.userService.create(signupDto);
        const result = await this.generateTokens(user,res);

        return res.status(201).json({
            message: 'User registered successfully',
          });
    }

    async login(loginDto: LoginDto, res: Response): Promise<Response> {
        const { identifier, password } = loginDto;
        const user = await this.userService.findByField(identifier);
        if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new UnauthorizedException('Invalid credentials');
        }
        if (user.deletedAt) {
          throw new UnauthorizedException('User account has been deactivated');
        }
        await this.generateTokens(user, res);
        return res.status(200).json({
          message: 'User logged in successfully',
        });
      }

    private async generateTokens(user: User,res:Response): Promise<Boolean> {
        const payload = { id: user.id };
        const accessToken = this.jwtService.sign(payload, {
            expiresIn: '24h',
            secret: process.env.JWT_SECRET
        });
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
            secret: process.env.REFRESH_TOKEN_SECRET
        });
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
          });
      
          res.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
          });

        return true;
    }


    async refreshToken(req: Request, res: Response): Promise<Response> {
        try {
          const refreshToken = req.cookies.refresh_token;
          const payload = this.jwtService.verify(refreshToken, { secret: process.env.REFRESH_TOKEN_SECRET });
          const user = await this.userService.findOneById(payload.id);
    
          if (!user) {
            throw new UnauthorizedException('Invalid refresh token');
          }
          await this.generateTokens(user,res);
          return res.status(200).json({ message: 'Token refreshed' });
        } catch (err) {
          throw new UnauthorizedException('Invalid or expired refresh token');
        }
      }

      async logout(res: Response): Promise<Response> {
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');
        return res.status(200).json({ message: 'Logged out successfully' });
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

    async restoreAccount(email: string) {
        const user = await this.userService.findByField(email, { withDeleted: true });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const token = this.jwtService.sign({ id: user.id }, { secret: process.env.RECOVER_SECRET, expiresIn: '1h' });
        await this.mailService.sendRestoreAccountEmail(email, token);

        return { message: 'Restore account email sent' };
    }
    async handleRestoreAccount(token: string) {
        try {
            const decoded = this.jwtService.verify(token, { secret: process.env.RECOVER_SECRET });
            const user = await this.userService.findOne({ where: { id: decoded.id }, withDeleted: true });
            if (!user) {
                throw new NotFoundException('User not found');
            }

            await this.userService.restore(user.id);

            return { message: 'Account successfully restored' };
        } catch (error) {
            throw new BadRequestException('Invalid or expired token');
        }
    }

}
