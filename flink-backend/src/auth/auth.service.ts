import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/modules/user/entities/user.entity';
import { UserService } from 'src/modules/user/user.service';


@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
    ) { }

    async validateUser(identifier: string, password: string): Promise<any> {
        let user: User | undefined;

        if (identifier.includes('@')) {
            user = await this.userService.findByEmail(identifier);
        } else if (/^\d+$/.test(identifier)) {
            user = await this.userService.findByPhone(identifier);
        } else {
            user = await this.userService.findByUsername(identifier);
        }

        if (user && (await this.userService.validatePassword(password, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }

    async login(user: User) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }

    async refreshToken(user: User) {
        const payload = { username: user.username, sub: user.id };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
