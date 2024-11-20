import { Controller } from '@nestjs/common';
import { ConditionService } from './condition.service';
import { Condition } from 'src/entities/condition/condition.entity';
import { CrudController } from 'src/common/crud/controller/crud.controller';
import { CreateConditionDto } from 'src/entities/condition/dtos/create-condition.dto';
import { UpdateConditionDto } from 'src/entities/condition/dtos/update-condition.dto';

@Controller('conditions')
export class ConditionController extends CrudController<
  Condition,
  CreateConditionDto,
  UpdateConditionDto
> {
  constructor(private readonly conditionService: ConditionService) {
    super(conditionService);
  }
}
