import {
  Controller,
  UseGuards,
} from '@nestjs/common';
import { CommonController } from 'src/common/controller/common.controller';
import { Hobby } from './entities/hobby.entity';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { UpdateHobbyDto } from './dto/update-hobby.dto';
import { HobbyService } from './hobby.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@UseGuards(AdminGuard)
@Controller('hobbies')
export class HobbyController extends CommonController<Hobby, CreateHobbyDto, UpdateHobbyDto> {
  constructor(private readonly hobbyService: HobbyService) {
    super(hobbyService);
  }
}
