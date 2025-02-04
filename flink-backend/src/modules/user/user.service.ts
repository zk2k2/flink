import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { CommonService } from 'src/common/service/common.service';
import { User } from 'src/modules/user/entities/user.entity';
import { FindOneOptions, Repository } from 'typeorm';
import { SignupDto } from './dto/signup-user.dto';
import { Location } from '../../common/entities/location.entity';
import { HobbyService } from '../hobby/hobby.service';
import { UserHobbiesService } from '../user-hobbies/user-hobbies.service';
import { UserHobby } from '../user-hobbies/entities/user-hobby.entity';
import { forwardRef, Inject } from '@nestjs/common';
import { LocationDto } from 'src/common/dto/location-dto';
@Injectable()
export class UserService extends CommonService<User> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
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
    const hashedPassword = await bcrypt.hash(
      signupDto.password,
      parseInt(process.env.JWT_SALT || '10'),
    );

    if (userExists) {
      throw new Error('User already exists');
    }

    const savedLocation = await this.createLocation(signupDto.location);

    const newUser = this.userRepository.create({
      ...signupDto,
      password: hashedPassword,
      location: savedLocation,
    });
    const savedUser = await this.userRepository.save(newUser);
    if (signupDto.hobbies && signupDto.hobbies.length > 0) {
      for (const hobbyDto of signupDto.hobbies) {
        const hobby = await this.hobbyService.findByField(
          'id',
          hobbyDto.hobbyId,
        );
        if (!hobby) {
          throw new Error(`Hobby "${hobbyDto.hobbyId}" does not exist.`);
        }
        const newUserHobby = new UserHobby();
        newUserHobby.user = savedUser;
        newUserHobby.hobby = hobby;
        newUserHobby.interestLevel = hobbyDto.interestLevel;
        await this.UserHobbiesService.create(newUserHobby);
      }

      return savedUser;
    }
  }

  async createLocation(createLocation: LocationDto): Promise<Location> {
    const newLocation = this.locationRepository.create({
      name: createLocation.name,
      coordinates: {
        type: 'Point',
        coordinates: [createLocation.longitude, createLocation.latitude],
      },
    });
    return await this.locationRepository.save(newLocation);
  }

  async updateLocation(
    userId: string,
    newLocation: LocationDto,
  ): Promise<User> {
    const user = await this.findOneById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.location) {
      await this.locationRepository.remove(user.location);
    }
    const updatedLocation = await this.createLocation(newLocation);
    return this.update(userId, { location: updatedLocation });
  }
 
  async findByField(identifier: string, options?: FindOneOptions<User>): Promise<User> {
 
    const phoneRegex = /^\+216\d{8}$/;
    const field = identifier.includes('@')
      ? 'email'
      : phoneRegex.test(identifier)
        ? 'phone'
        : 'username';

    const findOptions: FindOneOptions<User> = {
      where: { [field]: identifier },
      ...options,
    };
    return this.findOne(findOptions);
  }

  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

 
 
  async updatePassword(id: string, newPassword: string): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      newPassword,
      process.env.JWT_SALT || 10,
    );
    return this.update(id, { password: hashedPassword });
  }

  async getFollowers(userId: string): Promise<User[]> {
    const user = await this.findOne({
      where: { id: userId },
      relations: ['followers'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user.followers;
  }

  async getFollowings(userId: string): Promise<User[]> {
    const user = await this.findOne({
      where: { id: userId },
      relations: ['following'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user.following || [];
  }

  async getAchievements(userId: string) {
    const user = await this.findOne({
      where: { id: userId },
      relations: ['achievements'],
    });
    if (!user) {
      throw new Error('User not found');
    }
    return user.achievements || [];
  }

  async getProfile(identifier: string) {
    const user = await this.findByField(identifier, {
      relations: ['achievements', 'following', 'followers', 'userHobbies'],
    });

    if (!user) {
      throw new Error('User not found');
    }
    const profileData = {
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      profilePic: user.profilePic,
      xp: user.xp,
      followersCount: user.followers?.length,
      followingCount: user.following?.length,
      achievements: user.achievements,
      hobbies: user.userHobbies?.map((hobby) => hobby.hobby.title),
      postsCount: user.createdActivities?.length,
    };
    return profileData;
  }
}
