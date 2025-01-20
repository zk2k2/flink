import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignupDto } from 'src/modules/user/dto/signup-user.dto';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) { }

    async signup(signupDto: SignupDto): Promise<{ message: string; user: User; accessToken: string; refreshToken: string }> {
        const hashedPassword = await bcrypt.hash(signupDto.password, parseInt(process.env.JWT_SALT|| '10')); 
        const user = await this.userService.create({
          ...signupDto,
          password: hashedPassword,
        });
    
        const { accessToken, refreshToken } = await this.generateTokens(user);
    
        return { 
            message: 'User registered successfully', 
            user, 
            accessToken, 
            refreshToken 
        };
    }
    


    async login(identifier: string, password: string): Promise<{ accessToken: string; refreshToken: string }> {
        const field = identifier.includes('@') ? 'email' : /^\d+$/.test(identifier) ? 'phone' : 'username';
        const user = await this.userService.findByField(field, identifier);
    
        if (!user || !(await bcrypt.compare(password, user.password))) {
          throw new UnauthorizedException('Invalid credentials');
        }
    
        return this.generateTokens(user);
      }

    private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = { id: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
        expiresIn: '7d',
        secret: process.env.REFRESH_TOKEN_SECRET}); // to do add in env file

    await this.userService.updateRefreshToken(user.id, refreshToken);
    return { accessToken, refreshToken };
    }
    

    async refreshToken(refreshToken: string): Promise<any> {
        try {
          const payload = this.jwtService.verify(refreshToken, { secret: process.env.JWT_SECRET });
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

      
}
