import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hobby } from './entities/hobby.entity';
import { HobbyService } from './hobby.service';
import { HobbyController } from './hobby.controller';
import { CategoryModule } from '../category/category.module';
@Module({
  imports: [TypeOrmModule.forFeature([Hobby]), CategoryModule],
  providers: [HobbyService],
  controllers: [HobbyController],
  exports: [HobbyService]
})
export class HobbyModule { }