import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/user/entities/user.entity';
import { Location } from '../../common/entities/location.entity';
import { HobbyModule } from '../hobby/hobby.module';

@Module({
  imports: [HobbyModule, TypeOrmModule.forFeature([User, Location])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
