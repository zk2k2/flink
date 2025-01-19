import { Controller } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { Achievement } from 'src/entities/achievement/achievement.entity';
import { CommonController } from 'src/common/controller/common.controller';
import { CreateAchievementDto } from 'src/entities/achievement/dtos/create-achievement.dto';
import { UpdateAchievementDto } from 'src/entities/achievement/dtos/update-achievement.dto';

@Controller('achievements')
export class AchievementController extends CommonController<
  Achievement,
  CreateAchievementDto,
  UpdateAchievementDto
> {
  constructor(private readonly achievementService: AchievementService) {
    super(achievementService);
  }
}
