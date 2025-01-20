import { Controller } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { Achievement } from 'src/modules/achievement/entities/achievement.entity';
import { CommonController } from 'src/common/controller/common.controller';
import { CreateAchievementDto } from 'src/modules/achievement/dto/create-achievement.dto';
import { UpdateAchievementDto } from 'src/modules/achievement/dto/update-achievement.dto';

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
