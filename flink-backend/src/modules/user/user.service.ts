import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'; // Import bcrypt for password hashing and validation

import { CommonService } from 'src/common/service/common.service';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup-user.dto';
import { UpdateProfileDto } from './dto/update-user.dto';
import { Location } from '../../common/entities/location.entity';

@Injectable()
export class UserService extends CommonService<
  User,
  SignupDto,
  UpdateProfileDto
> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {
    super(userRepository);
  }

  async create(signupDto: SignupDto): Promise<User> {
    const userExists = await this.userRepository.findOne({
      where: [
        { email: signupDto.email },
        { username: signupDto.username },
        { phone: signupDto.phone },
      ],
    });

    if (userExists) {
      throw new Error(
        'User with provided email, username, or phone already exists',
      );
    }

    // Ensure location is correctly handled
    const newLocation = this.locationRepository.create(signupDto.location);
    const savedLocation = await this.locationRepository.save(newLocation);

    const newUser = this.userRepository.create({
      ...signupDto,
      location: savedLocation,
    });

    return await this.userRepository.save(newUser);
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
