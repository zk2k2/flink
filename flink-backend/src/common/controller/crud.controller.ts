import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CrudService } from '../service/crud.service';
import { DeepPartial } from 'typeorm';

@Controller(':entity')
export class CrudController<
  T extends { id: number },
  CreateDto extends DeepPartial<T>,
  UpdateDto extends DeepPartial<T>,
> {
  constructor(
    private readonly crudService: CrudService<T, CreateDto, UpdateDto>,
  ) {}

  @Post()
  async create(@Body() createDto: CreateDto): Promise<T> {
    try {
      return await this.crudService.create(createDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateDto,
  ): Promise<T> {
    try {
      return await this.crudService.update(id, updateDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<T> {
    try {
      return await this.crudService.findOneById(id);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.NOT_FOUND,
      );
    }
  }

  @Get()
  async findAll(): Promise<T[]> {
    try {
      return await this.crudService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    try {
      await this.crudService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id/soft') 
  async softRemove(@Param('id') id: number): Promise<void> {
    try {
      await this.crudService.softRemove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':id/restore') 
  async restore(@Param('id') id: number): Promise<void> {
    try {
      await this.crudService.restore(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
