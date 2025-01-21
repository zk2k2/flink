import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hobby } from 'src/modules/hobby/entities/hobby.entity';
import { UserHobby } from 'src/modules/hobby/entities/user-hobby.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { CommonService } from 'src/common/service/common.service';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { UpdateHobbyDto } from './dto/update-hobby.dto';

@Injectable()
export class HobbyService extends CommonService<Hobby, CreateHobbyDto, UpdateHobbyDto> {
  constructor(
    @InjectRepository(Hobby)
    private readonly hobbyRepository: Repository<Hobby>,
    @InjectRepository(UserHobby)
    private readonly userHobbyRepository: Repository<UserHobby>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(hobbyRepository);
  }

  async getAllUserHobbies(): Promise<UserHobby[]> {
    return this.userHobbyRepository.find({
      relations: ['user', 'hobby'],
    });
  }

  async getUserHobbiesByUserId(userId: string): Promise<UserHobby[]> {
    return this.userHobbyRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'hobby'], 
    
      select: {
        id: true,
        interestLevel: true,
        user: { id: true, name: true },
        hobby: { id: true, title: true, photo: true },
      },
    });
  }

  async addHobbyToUser(userId: string, hobbyId: string, interestLevel: number): Promise<UserHobby> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const hobby = await this.hobbyRepository.findOne({ where: { id: hobbyId } });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }
    if (!hobby) {
      throw new NotFoundException(`Hobby with ID ${hobbyId} not found`);
    }

    const existingUserHobby = await this.userHobbyRepository.findOne({
      where: { user: { id: userId }, hobby: { id: hobbyId } },
    });

    if (existingUserHobby) {
      throw new NotFoundException('User already has this hobby');
    }

    const userHobby = this.userHobbyRepository.create({
      user,
      hobby,
      interestLevel,
    });

    return this.userHobbyRepository.save(userHobby);
  }

  async updateInterestLevel(userId: string, hobbyId: string, interestLevel: number): Promise<UserHobby> {
    const userHobby = await this.userHobbyRepository.findOne({
      where: { user: { id: userId }, hobby: { id: hobbyId } },
    });

    if (!userHobby) {
      throw new NotFoundException('UserHobby association not found');
    }

    userHobby.interestLevel = interestLevel;

    return this.userHobbyRepository.save(userHobby);
  }

  async removeHobbyFromUser(userId: string, hobbyId: string): Promise<void> {
    const userHobby = await this.userHobbyRepository.findOne({
      where: { user: { id: userId }, hobby: { id: hobbyId } },
    });

    if (!userHobby) {
      throw new NotFoundException('UserHobby association not found');
    }

    await this.userHobbyRepository.remove(userHobby);
  }
}