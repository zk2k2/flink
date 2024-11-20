import { Repository, FindOptionsWhere, FindManyOptions } from 'typeorm';
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class CrudService<T, CreateDto, UpdateDto> {
  constructor(private readonly repository: Repository<T>) {}

  async create(createDto: CreateDto): Promise<T> {
    try {
      return await this.repository.save(createDto as any);
    } catch (error) {
      throw new HttpException(
        `Failed to create entity: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateDto: UpdateDto): Promise<T> {
    try {
      await this.repository.update(id, updateDto as any);
      return await this.findOneById(id);
    } catch (error) {
      throw new HttpException(
        `Failed to update entity with ID ${id}: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneById(id: number): Promise<T> {
    const entity = await this.repository.findOneBy({
      id,
    } as unknown as FindOptionsWhere<T>);
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    return entity;
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }

  async remove(id: number): Promise<void> {
    const entity = await this.findOneById(id);
    if (!entity) {
      throw new NotFoundException(`Entity with ID ${id} not found`);
    }
    await this.repository.delete(id);
  }
}
