import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserHobby } from './entities/user-hobby.entity';
import { Hobby } from './entities/hobby.entity';
import { HobbyService } from './hobby.service';
import { HobbyController } from './hobby.controller';
import { User } from '../user/entities/user.entity';
import { UserHobbiesService } from './user-hobbies.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserHobby,User,Hobby])],
  providers: [HobbyService, UserHobbiesService],
  controllers: [HobbyController],
  exports:[HobbyService, UserHobbiesService]
})
export class HobbyModule {}