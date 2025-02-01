import { PartialType } from '@nestjs/mapped-types';
import { Achievement } from '../entities/achievement.entity';
export class UpdateAchievementDto extends PartialType(Achievement) {
}
