import { Module } from '@nestjs/common';
import { ConditionService } from './condition.service';
import { ConditionController } from './condition.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Condition } from 'src/entities/condition/condition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Condition])],
  controllers: [ConditionController],
  providers: [ConditionService],
})
export class ConditionModule {}
