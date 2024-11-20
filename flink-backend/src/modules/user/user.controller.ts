import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { CrudController } from 'src/common/crud/controller/crud.controller';
import { User } from 'src/entities/user/user.entity';
import { CreateUserDto } from 'src/entities/user/dtos/create-user.dto';
import { UpdateUserDto } from 'src/entities/user/dtos/update-user.dto';

@Controller('users')
export class UserController extends CrudController<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}
