import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserHobby } from './entities/user-hobby.entity';
import { Hobby } from './entities/hobby.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserHobby, Hobby])],
})
export class HobbyModule {}