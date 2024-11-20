import { Controller } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { Achievement } from 'src/entities/achievement/achievement.entity';
import { CrudController } from 'src/common/crud/controller/crud.controller';
import { CreateAchievementDto } from 'src/entities/achievement/dtos/create-achievement.dto';
import { UpdateAchievementDto } from 'src/entities/achievement/dtos/update-achievement.dto';

@Controller('achievements')
export class AchievementController extends CrudController<
  Achievement,
  CreateAchievementDto,
  UpdateAchievementDto
> {
  constructor(private readonly achievementService: AchievementService) {
    super(achievementService);
  }
}
