import { Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/service/common.service';
import { CreateAchievementDto } from 'src/modules/achievement/dto/create-achievement.dto';
import { Activity } from 'src/modules/activity/entities/activity.entity';
import { CreateActivityDto } from 'src/modules/activity/dto/create-activity.dto';
import { UpdateActivityDto } from 'src/modules/activity/dto/update-activity.dto';
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
