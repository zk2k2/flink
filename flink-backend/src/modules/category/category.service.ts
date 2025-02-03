import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CommonService } from '../../common/service/common.service';

@Injectable()
export class CategoryService extends CommonService<Category> {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>
    ) {
        super(categoryRepository);
    }

    async findByField(field: string, value: string): Promise<Category> {
        return this.findOne({ where: { [field]: value } });
    }

}