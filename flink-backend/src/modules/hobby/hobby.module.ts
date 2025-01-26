import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserHobby } from './entities/user-hobby.entity';
import { Hobby } from './entities/hobby.entity';
import { HobbyService } from './hobby.service';
import { HobbyController } from './hobby.controller';
import { User } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserHobby, Hobby, User])],
  providers: [HobbyService],
  controllers: [HobbyController],
})
export class HobbyModule {}