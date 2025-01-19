import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/service/common.service';
import { Achievement } from 'src/entities/achievement/achievement.entity';
import { CreateAchievementDto } from 'src/entities/achievement/dtos/create-achievement.dto';
import { UpdateAchievementDto } from 'src/entities/achievement/dtos/update-achievement.dto';
import { Repository } from 'typeorm';

@Injectable()
export class AchievementService extends CommonService<
  Achievement,
  CreateAchievementDto,
  UpdateAchievementDto
> {
  constructor(
    @InjectRepository(Achievement)
    private readonly achievementRepository: Repository<Achievement>,
  ) {
    super(achievementRepository);
  }
}
