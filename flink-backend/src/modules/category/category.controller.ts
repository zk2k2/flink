import { Controller } from '@nestjs/common';
import { CommonController } from 'src/common/controller/common.controller';
import { Category } from './entities/category.entity';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
export class CategoryController extends CommonController<Category, CreateCategoryDto, UpdateCategoryDto> {
    constructor(private readonly categoryService: CategoryService) {
        super(categoryService);
    }
}
