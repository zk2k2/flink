import { Controller, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CommonController } from 'src/common/controller/common.controller';
import { User } from 'src/modules/user/entities/user.entity';
import { SignupDto } from './dto/signup-user.dto';
import { UpdateProfileDto } from './dto/update-user.dto';
import { AdminGuard } from '../auth/guards/admin.guard';

//@UseGuards(AdminGuard)
@Controller('users')
export class UserController extends CommonController<
  User,
  SignupDto,
  UpdateProfileDto
> {
  constructor(private readonly userService: UserService) {
    super(userService);
  }
}
