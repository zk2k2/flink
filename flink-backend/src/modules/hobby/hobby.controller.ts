import {
  Controller,
  Post,
  Body,
  Delete,
  Patch,
  NotFoundException,
  Get,
  Param,
} from '@nestjs/common';
import { HobbyService } from './hobby.service';
import { CommonController } from 'src/common/controller/common.controller';
import { Hobby } from './entities/hobby.entity';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { UpdateHobbyDto } from './dto/update-hobby.dto';
import { UserHobby } from './entities/user-hobby.entity';

@Controller('hobbies')
export class HobbyController extends CommonController<
  Hobby,
  CreateHobbyDto,
  UpdateHobbyDto
> {
  constructor(private readonly hobbyService: HobbyService) {
    super(hobbyService);
  }

  @Get('user-hobbies')
  async getAllUserHobbies(): Promise<UserHobby[]> {
    try {
      return await this.hobbyService.getAllUserHobbies();
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Get('user/:userId')
  async getUserHobbiesByUserId(
    @Param('userId') userId: string,
  ): Promise<UserHobby[]> {
    try {
      return await this.hobbyService.getUserHobbiesByUserId(userId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post('add-hobby')
  async addHobbyToUser(
    @Body('userId') userId: string,
    @Body('hobbyId') hobbyId: string,
    @Body('interestLevel') interestLevel: number,
  ): Promise<UserHobby> {
    try {
      return await this.hobbyService.addHobbyToUser(userId, hobbyId, interestLevel);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Patch('update-interest')
  async updateInterestLevel(
    @Body('userId') userId: string,
    @Body('hobbyId') hobbyId: string,
    @Body('interestLevel') interestLevel: number,
  ): Promise<UserHobby> {
    try {
      return await this.hobbyService.updateInterestLevel(userId, hobbyId, interestLevel);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete('remove-hobby')
  async removeHobbyFromUser(
    @Body('userId') userId: string,
    @Body('hobbyId') hobbyId: string,
  ): Promise<void> {
    try {
      await this.hobbyService.removeHobbyFromUser(userId, hobbyId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
}