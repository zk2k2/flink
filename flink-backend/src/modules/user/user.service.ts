import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CommonService } from 'src/common/service/common.service';
import { User } from 'src/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { SignupDto } from './dto/signup-user.dto';
import { UpdateProfileDto } from './dto/update-user.dto';

@Injectable()
export class UserService extends CommonService<
  User,
  SignupDto,
  UpdateProfileDto> {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super(userRepository);
  }
}
