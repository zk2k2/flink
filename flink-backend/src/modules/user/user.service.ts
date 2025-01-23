import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing and validation

import { CommonService } from 'src/common/service/common.service';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup-user.dto';
import { UpdateProfileDto } from './dto/update-user.dto';

@Injectable()
export class UserService extends CommonService<
  User,
  SignupDto,
  UpdateProfileDto
> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async findByField(field: string, value: string): Promise<User> {
    return this.userRepository.findOne({ where: { [field]: value } });
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    if (!userId) {
      throw new Error('Invalid userId provided');
    }

    await this.userRepository.update(
      { id: userId },
      { refreshToken }
    );
  }


  async clearRefreshToken(userId: string): Promise<void> {
    console.log('userId', userId);
    if (!userId) {
      throw new Error('Invalid userId provided');
    }

    await this.userRepository.update(
      { id: userId },
      { refreshToken: null }
    );
  }

}
