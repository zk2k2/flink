import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommonController } from 'src/common/controller/common.controller';
import { Hobby } from './entities/hobby.entity';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { UpdateHobbyDto } from './dto/update-hobby.dto';
import { HobbyService } from './hobby.service';
import { AdminGuard } from '../auth/guards/admin.guard';

//@UseGuards(AdminGuard)
@Controller('hobbies')
export class HobbyController extends CommonController<Hobby, CreateHobbyDto, UpdateHobbyDto> {
  constructor(private readonly hobbyService: HobbyService) {
    super(hobbyService);
  }
  
  @Post()
  @UseGuards(AdminGuard)
  async create(@Body() createHobbyDto: CreateHobbyDto): Promise<Hobby> {
    try {
      return await this.hobbyService.createHobby(createHobbyDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

}

