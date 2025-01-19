import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { CommonController } from 'src/common/controller/common.controller';
import { User } from 'src/entities/user/user.entity';
import { CreateUserDto } from 'src/entities/user/dtos/create-user.dto';
import { UpdateUserDto } from 'src/entities/user/dtos/update-user.dto';

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
