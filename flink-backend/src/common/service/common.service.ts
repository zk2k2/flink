import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  DeepPartial,
  FindOneOptions,
} from 'typeorm';
import {
  Injectable,
  NotFoundException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Injectable()
export class CommonService<T extends { id: string }> {
  constructor(private readonly repository: Repository<T>) { }

  private getEntityName(): string {
    return this.repository.metadata.name;
  }

  async create(createDto: DeepPartial<T>): Promise<T> {
    try {
      const entity = this.repository.create(createDto);
      return await this.repository.save(entity);
    } catch (error) {
      throw new HttpException(
        `Failed to create ${this.getEntityName()}: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updateDto: DeepPartial<T>): Promise<T> {
    try {
      const entity = await this.findOneById(id);
      const updatedEntity = this.repository.merge(entity, updateDto);
      return await this.repository.save(updatedEntity);
    } catch (error) {
      throw new HttpException(
        `Failed to update ${this.getEntityName()} with ID ${id}: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneById(id: string): Promise<T> {
    const entity = await this.repository.findOneBy({
      id,
    } as FindOptionsWhere<T>);
    if (!entity) {
      throw new NotFoundException(`${this.getEntityName()} with ID ${id} not found`);
    }
    return entity;
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.repository.find(options);
  }
  async findOne(options: FindOneOptions<T>): Promise<T> {
    const entity = await this.repository.findOne(options);
    return entity;
  }

  async remove(id: string): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`${this.getEntityName()} with ID ${id} not found`);
    }
  }

  async softRemove(id: string): Promise<void> {
    const result = await this.repository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`${this.getEntityName()} with ID ${id} not found`);
    }
  }

  async restore(id: string): Promise<void> {
    const result = await this.repository.restore(id);
    if (result.affected === 0) {
      throw new NotFoundException(`${this.getEntityName()} with ID ${id} not found`);
    }
  }
}
