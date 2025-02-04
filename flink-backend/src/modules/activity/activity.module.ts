import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { Activity } from './entities/activity.entity';
import { Location } from '../../common/entities/location.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { Category } from '../category/entities/category.entity';
import { CategoryModule } from '../category/category.module';
import { S3Service } from 'src/common/service/s3.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity, Location, Category]),
    UserModule,
    CategoryModule,
  ],
  controllers: [ActivityController],
  providers: [ActivityService, S3Service],
})
export class ActivityModule {}
