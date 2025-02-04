import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
  Body,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CommonController } from 'src/common/controller/common.controller';
import { Activity } from 'src/modules/activity/entities/activity.entity';
import { CreateActivityDto } from 'src/modules/activity/dto/create-activity.dto';
import { UpdateActivityDto } from 'src/modules/activity/dto/update-activity.dto';
import { ActivitySortCriteria } from 'src/common/enums/activity-sort-criteria.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UseInterceptors } from '@nestjs/common';
import { UploadedFiles } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ValidationPipe } from '@nestjs/common';

@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivityController extends CommonController<
  Activity,
  CreateActivityDto,
  UpdateActivityDto
> {
  constructor(private readonly activityService: ActivityService) {
    super(activityService);
  }

  @Get()
  async getActivities(
    @Req() req,
    @Query('sortBy') sortBy: ActivitySortCriteria,
    @Query('type') type: 'feed' | 'profile',
    @Query('timeFrame') timeFrame?: 'past' | 'recent',
    @Query('creatorId') creatorId?: string,
  ): Promise<Activity[]> {
    const userId = req.user.id;

    if (!userId) {
      throw new HttpException(
        'User ID is missing in authentication token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      return await this.activityService.getActivities(
        userId,
        sortBy,
        type,
        timeFrame,
        creatorId,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'photos', maxCount: 5 }]))
  async createActivity(
    @Req() req,
    @UploadedFiles() files: { photos?: Express.Multer.File[] },
    @Body() body: any,
  ): Promise<Activity> {
    const userId = req.user.id;

    if (!userId) {
      throw new HttpException(
        'User ID is missing in authentication token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      if (!body.data) {
        throw new HttpException('Missing data field', HttpStatus.BAD_REQUEST);
      }

      const parsedData = JSON.parse(body.data);
      const createActivityDto = plainToInstance(CreateActivityDto, parsedData);

      return await this.activityService.createActivity(
        userId,
        createActivityDto,
        files?.photos,
      );
    } catch (error) {
      throw new HttpException(
        error.message || 'Invalid request',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch('join')
  async joinActivity(
    @Req() req,
    @Query('activityId') activityId: string,
  ): Promise<Activity> {
    const userId = req.user.id;

    if (!userId) {
      throw new HttpException(
        'User ID is missing in authentication token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      return await this.activityService.joinActivity(userId, activityId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch('leave')
  async leaveActivity(
    @Req() req,
    @Query('activityId') activityId: string,
  ): Promise<Activity> {
    const userId = req.user.id;

    if (!userId) {
      throw new HttpException(
        'User ID is missing in authentication token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      return await this.activityService.leaveActivity(userId, activityId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async deleteActivity(
    @Req() req,
    @Query('activityId') activityId: string,
  ): Promise<void> {
    const userId = req.user.id;

    if (!userId) {
      throw new HttpException(
        'User ID is missing in authentication token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      return await this.activityService.deleteActivity(userId, activityId);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
