import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonService } from 'src/common/service/common.service';
import { Condition } from 'src/entities/condition/condition.entity';
import { CreateConditionDto } from 'src/entities/condition/dtos/create-condition.dto';
import { UpdateConditionDto } from 'src/entities/condition/dtos/update-condition.dto';
import { Repository } from 'typeorm';

@Injectable()
export class ConditionService extends CommonService<
  Condition,
  CreateConditionDto,
  UpdateConditionDto
> {
  constructor(
    @InjectRepository(Condition)
    private readonly conditionRepository: Repository<Condition>,
  ) {
    super(conditionRepository);
  }
}
