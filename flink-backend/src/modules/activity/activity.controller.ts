import { Controller } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CommonController } from 'src/common/controller/common.controller';
import { Activity } from 'src/modules/activity/entities/activity.entity';
import { CreateActivityDto } from 'src/modules/activity/dto/create-activity.dto';
import { UpdateActivityDto } from 'src/modules/activity/dto/update-activity.dto';
import { Get, Query, HttpException, HttpStatus, Headers } from '@nestjs/common';
import { ActivitySortCriteria } from '../../common/enums/activity-sort-criteria.enum';

@Controller('activities')
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
    @Query('sortBy') sortBy: ActivitySortCriteria,
    @Headers('User-Id') userId: string,
  ): Promise<Activity[]> {
    if (!userId) {
      throw new HttpException(
        'User ID is required in headers',
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      return await this.activityService.getActivities(userId, sortBy);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
