import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CommonService } from 'src/common/service/common.service';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup-user.dto';
import { Location } from '../../common/entities/location.entity';
import { HobbyService } from '../hobby/hobby.service';
import { UserHobbiesService } from '../user-hobbies/user-hobbies.service';
import { UserHobby } from '../user-hobbies/entities/user-hobby.entity';
import { forwardRef, Inject } from '@nestjs/common';
@Injectable()
export class UserService extends CommonService<
  User
> {

  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
    private readonly hobbyService: HobbyService,
    @Inject(forwardRef(() => UserHobbiesService))
    private readonly UserHobbiesService: UserHobbiesService,
  ) {
    super(userRepository);
  }
  async create(signupDto: SignupDto): Promise<User> {
    const userExists = await this.findOne({
      where: [
        { email: signupDto.email },
        { username: signupDto.username },
        { phone: signupDto.phone },
      ],
    });

    if (userExists) {
      throw new Error('User already exists');
    }
    const newLocation = this.locationRepository.create({
      name: signupDto.location.name,
      coordinates: {
        type: 'Point',
        coordinates: [signupDto.location.longitude, signupDto.location.latitude],
      },
    });
    const savedLocation = await this.locationRepository.save(newLocation);


    const newUser = this.userRepository.create({
      ...signupDto,
      location: savedLocation,
    });
    const savedUser = await this.userRepository.save(newUser);
    if (signupDto.hobbies && signupDto.hobbies.length > 0) {
      for (const hobbyDto of signupDto.hobbies) {
        const hobby = await this.hobbyService.findByField('title', hobbyDto.title);
        if (!hobby) {
          throw new Error(`Hobby "${hobbyDto.title}" does not exist.`);
        }
        const newUserHobby = new UserHobby();
        newUserHobby.user = savedUser;
        newUserHobby.hobby = hobby;
        newUserHobby.interestLevel = hobbyDto.interestLevel;
        await this.UserHobbiesService.create(
          newUserHobby
        );
      }

      return savedUser;
    }
  }

  async findByField(field: string, value: string): Promise<User> {
    return this.findOne({ where: { [field]: value } });
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

    await this.update(
      userId,
      { refreshToken }
    );
  }


  async clearRefreshToken(userId: string): Promise<void> {
    if (!userId) {
      throw new Error('Invalid userId provided');
    }

    await this.update(
      userId,
      { refreshToken: null }
    );
  }

  async updatePassword(id: string, hashedPassword: string): Promise<User> {
    return this.update(id, { password: hashedPassword });
  }

  async getFollowers(userId: string): Promise<User[]> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.followers;
  }

  async getFollowings(userId: string): Promise<User[]> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.following || [];
  }
}
