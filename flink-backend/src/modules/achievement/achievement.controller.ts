import { Controller, UseGuards } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { Achievement } from 'src/modules/achievement/entities/achievement.entity';
import { CommonController } from 'src/common/controller/common.controller';
import { UpdateAchievementDto } from 'src/modules/achievement/dto/update-achievement.dto';
import { AdminGuard } from '../auth/guards/admin.guard';

@UseGuards(AdminGuard)
@Controller('achievements')
export class AchievementController extends CommonController<
  Achievement,
  Achievement,
  UpdateAchievementDto
> {
  constructor(private readonly achievementService: AchievementService) {
    super(achievementService);
  }
}
