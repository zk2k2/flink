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
import { CommonService } from '../service/common.service';
import { DeepPartial } from 'typeorm';

@Controller(':entity')
export class CommonController<
  T extends { id: number },
  CreateDto extends DeepPartial<T>,
  UpdateDto extends DeepPartial<T>,
> {
  constructor(
    private readonly commonService: CommonService<T, CreateDto, UpdateDto>,
  ) {}

  @Post()
  async create(@Body() createDto: CreateDto): Promise<T> {
    try {
      return await this.commonService.create(createDto);
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
      return await this.commonService.update(id, updateDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<T> {
    try {
      return await this.commonService.findOneById(id);
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
      return await this.commonService.findAll();
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    try {
      await this.commonService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id/soft') 
  async softRemove(@Param('id') id: number): Promise<void> {
    try {
      await this.commonService.softRemove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post(':id/restore') 
  async restore(@Param('id') id: number): Promise<void> {
    try {
      await this.commonService.restore(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
