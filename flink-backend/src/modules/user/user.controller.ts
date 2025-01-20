import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { CommonController } from 'src/common/controller/common.controller';
import { User } from 'src/modules/user/entities/user.entity';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/user/dto/update-user.dto';

@Controller('users')
export class UserController extends CommonController<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}
