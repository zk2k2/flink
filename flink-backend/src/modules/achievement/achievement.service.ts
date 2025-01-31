import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/service/common.service';
import { Achievement } from 'src/modules/achievement/entities/achievement.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AchievementService extends CommonService<
  Achievement
> {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
  ) {
    super(achievementRepository);
  }
}
