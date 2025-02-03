import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hobby } from './entities/hobby.entity';
import { CreateHobbyDto } from './dto/create-hobby.dto';
import { CategoryService } from '../category/category.service';
import { CommonService } from 'src/common/service/common.service';
import { Category } from '../category/entities/category.entity';

@Injectable()
export class HobbyService extends CommonService<Hobby> {
  constructor(
    @InjectRepository(Hobby)
    private readonly hobbyRepository: Repository<Hobby>,
    private readonly categoryService: CategoryService
  ) {
    super(hobbyRepository);
  }

  async findByField(field: string, value: string): Promise<Hobby> {
    return this.findOne({ where: { [field]: value } });
  }

  async createHobby(createHobbyDto: CreateHobbyDto): Promise<Hobby> {
    const { categoryId, ...hobbyData } = createHobbyDto;
    const category: Category = await this.categoryService.findByField('id', categoryId);
    if (!category) {
      throw new Error('Category not found');
    }

    return this.create({
      ...hobbyData,
      category,
    });
  }
}