import { Module } from '@nestjs/common';
import { AchievementService } from './achievement.service';
import { AchievementController } from './achievement.controller';
import { Achievement } from 'src/entities/achievement/achievement.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement])],
  controllers: [AchievementController],
  providers: [AchievementService],
})
export class AchievementModule {}