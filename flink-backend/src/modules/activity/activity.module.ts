import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { Activity } from './entities/activity.entity';
import { Location } from '../../common/entities/location.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { Category } from 'src/common/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Activity, Location, User, Category]),UserModule],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
