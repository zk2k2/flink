import { Controller } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { CrudController } from 'src/common/crud/controller/crud.controller';
import { Activity } from 'src/entities/activity/activity.entity';
import { CreateActivityDto } from 'src/entities/activity/dtos/create-activity.dto';
import { UpdateActivityDto } from 'src/entities/activity/dtos/update-activity.dto';

@Controller('activities')
export class ActivityController extends CrudController<
  Activity,
  CreateActivityDto,
  UpdateActivityDto
> {
  constructor(private readonly activityService: ActivityService) {
    super(activityService);
  }
}
