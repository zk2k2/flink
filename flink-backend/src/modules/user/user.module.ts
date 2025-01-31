import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Location } from '../../common/entities/location.entity';
import { HobbyModule } from '../hobby/hobby.module';
import { UserHobbiesModule } from '../user-hobbies/user-hobbies.module';
import { ProfileController } from './profile.controller';
@Module({
  imports: [HobbyModule, forwardRef(() => UserHobbiesModule), TypeOrmModule.forFeature([User, Location])],
  controllers: [UserController, ProfileController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
