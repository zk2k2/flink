import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hobby } from 'src/modules/hobby/entities/hobby.entity';
import { CommonService } from 'src/common/service/common.service';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { UpdateHobbyDto } from './dto/update-hobby.dto';

@Injectable()
export class HobbyService extends CommonService<Hobby, CreateHobbyDto, UpdateHobbyDto> {
  constructor(
    @InjectRepository(Hobby)
    private readonly hobbyRepository: Repository<Hobby>
  ) {
    super(hobbyRepository);
  }
  async findByField(field: string, value: string): Promise<Hobby> {
    return this.hobbyRepository.findOne({ where: { [field]: value } });
  }

}