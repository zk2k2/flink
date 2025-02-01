import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserHobby } from './entities/user-hobby.entity';
import { UserHobbiesService } from './user-hobbies.service';
import { UserModule } from '../user/user.module';
import { HobbyModule } from '../hobby/hobby.module';
import { UserHobbiesController } from './user-hobbies.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserHobby]),
    forwardRef(() => UserModule),
    HobbyModule
  ],
  controllers: [UserHobbiesController],
  providers: [UserHobbiesService],
  exports: [UserHobbiesService],
})
export class UserHobbiesModule {}