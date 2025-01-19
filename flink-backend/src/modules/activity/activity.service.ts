import { Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/service/common.service';
import { CreateAchievementDto } from 'src/entities/achievement/dtos/create-achievement.dto';
import { Activity } from 'src/entities/activity/activity.entity';
import { CreateActivityDto } from 'src/entities/activity/dtos/create-activity.dto';
import { UpdateActivityDto } from 'src/entities/activity/dtos/update-activity.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ActivityService extends CommonService<
  Activity,
  CreateActivityDto,
  UpdateActivityDto
> {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {
    super(activityRepository);
  }
  
}
