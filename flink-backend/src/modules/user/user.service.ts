import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'; 
import { CommonService } from 'src/common/service/common.service';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup-user.dto';
import { UpdateProfileDto } from './dto/update-user.dto';
import { Location } from '../../common/entities/location.entity';
import { HobbyService } from '../hobby/hobby.service';
import { UserHobbiesService } from '../hobby/user-hobbies.service';
import { UserHobby } from '../hobby/entities/user-hobby.entity';
@Injectable()
export class UserService extends CommonService<
  User,
  SignupDto,
  UpdateProfileDto
> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Location) private readonly locationRepository: Repository<Location>,
    private readonly hobbyService: HobbyService,
    private readonly UserHobbiesService: UserHobbiesService,
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
        const hobby = await this.hobbyService.findByField('title',hobbyDto.title);
        if (!hobby) {
          throw new Error(`Hobby "${hobbyDto.title}" does not exist.`);
        }
        const newUserHobby = new UserHobby();
        newUserHobby.user = savedUser;
        newUserHobby.hobby = hobby;
        newUserHobby.interestLevel = hobbyDto.interestLevel;
        const savedUserHobby  = await this.UserHobbiesService.create(
          newUserHobby
        );
      }

    return savedUser;
  }
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
