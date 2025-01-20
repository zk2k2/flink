import { Controller } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CommonController } from 'src/common/controller/common.controller';
import { Activity } from 'src/modules/activity/entities/activity.entity';
import { CreateActivityDto } from 'src/modules/activity/dto/create-activity.dto';
import { UpdateActivityDto } from 'src/modules/activity/dto/update-activity.dto';

@Controller('activities')
export class ActivityController extends CommonController<
  Activity,
  CreateActivityDto,
  UpdateActivityDto
> {
  constructor(private readonly activityService: ActivityService) {
    super(activityService);
  }
}
