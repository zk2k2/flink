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
  T extends { id: string },
  CreateDto extends DeepPartial<T>,
  UpdateDto extends DeepPartial<T>,
> {
  constructor(
    private readonly commonService: CommonService<T>,
  ) { }

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
    @Param('id') id: string,
    @Body() updateDto: UpdateDto,
  ): Promise<T> {
    try {
      return await this.commonService.update(id, updateDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<T> {
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
  async remove(@Param('id') id: string): Promise<void> {
    try {
      await this.commonService.remove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('soft/:id')
  async softRemove(@Param('id') id: string): Promise<void> {
    try {
      await this.commonService.softRemove(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Post('restore/:id')
  async restore(@Param('id') id: string): Promise<void> {
    try {
      await this.commonService.restore(id);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
