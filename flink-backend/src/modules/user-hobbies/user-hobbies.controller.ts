import {
    Controller,
    Post,
    Body,
    Delete,
    Patch,
    Param,
    NotFoundException,
    UseGuards,
    Req,
    Get,
  } from '@nestjs/common';
  import { UserHobbiesService } from './user-hobbies.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserHobby } from './entities/user-hobby.entity';
import { Request } from 'express';
import { User } from 'src/modules/user/entities/user.entity';

@Controller('user-hobbies')
@UseGuards(JwtAuthGuard)
export class UserHobbiesController {
  constructor(private readonly userHobbiesService: UserHobbiesService) {}

  @Get()
  async getUserHobbies(@Req() req ): Promise<UserHobby[]> {
    const userId = req.user.id;
    try {
      return await this.userHobbiesService.getUserHobbiesByUserId(userId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Post()
  async addHobbyToUser(
    @Req() req ,
    @Body('hobbyId') hobbyId: string,
    @Body('interestLevel') interestLevel: number,
  ): Promise<UserHobby> {
    const userId = req.user.id;
    try {
      return await this.userHobbiesService.addHobbyToUser(userId, hobbyId, interestLevel);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Patch()
  async updateInterestLevel(
    @Req() req ,
    @Body('hobbyId') hobbyId: string,
    @Body('interestLevel') interestLevel: number,
  ): Promise<UserHobby> {
    const userId = req.user.id;
    try {
      return await this.userHobbiesService.updateInterestLevel(userId, hobbyId, interestLevel);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }

  @Delete()
  async removeHobbyFromUser(
    @Req() req ,
    @Body('hobbyId') hobbyId: string,
  ): Promise<void> {
    const userId = req.user.id;
    try {
      await this.userHobbiesService.removeHobbyFromUser(userId, hobbyId);
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }


}
