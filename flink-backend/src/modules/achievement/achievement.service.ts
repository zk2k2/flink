import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/service/common.service';
import { Achievement } from 'src/modules/achievement/entities/achievement.entity';
import { UpdateAchievementDto } from 'src/modules/achievement/dto/update-achievement.dto';
import { Repository } from 'typeorm';

@Injectable()
export class AchievementService extends CommonService<
  Achievement,
  Achievement,
  UpdateAchievementDto
> {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
  ) {
    super(achievementRepository);
  }
}
