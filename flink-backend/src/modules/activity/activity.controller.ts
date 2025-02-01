import { Controller, Req, UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CommonController } from 'src/common/controller/common.controller';
import { Activity } from 'src/modules/activity/entities/activity.entity';
import { CreateActivityDto } from 'src/modules/activity/dto/create-activity.dto';
import { UpdateActivityDto } from 'src/modules/activity/dto/update-activity.dto';
import { Get, Query, HttpException, HttpStatus, Headers } from '@nestjs/common';
import { ActivitySortCriteria } from '../../common/enums/activity-sort-criteria.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';


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
    @Query('sortBy') sortBy: ActivitySortCriteria,
    @Req() req,
  ): Promise<Activity[]> {
    const userId = req.user?.id;

    if (!userId) {
      throw new HttpException(
        'User ID is missing in authentication token',
        HttpStatus.UNAUTHORIZED,
      );
    }

    try {
      return await this.activityService.getActivities(userId, sortBy);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
