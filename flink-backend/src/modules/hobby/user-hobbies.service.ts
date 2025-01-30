import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/service/common.service';
import { UserHobby } from './entities/user-hobby.entity';
import { UpdateUserHobbiesDto } from './dto/update-user-hobbies.dto';
import { Repository } from 'typeorm';

@Injectable()
export class UserHobbiesService extends CommonService <UserHobby,UserHobby,UpdateUserHobbiesDto>{
    constructor(
        @InjectRepository(UserHobby)
        private readonly userHobbyRepository: Repository<UserHobby>,
      ) {
        super(userHobbyRepository);
      }
}
