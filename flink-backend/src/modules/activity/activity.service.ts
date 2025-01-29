import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { Location } from '../../common/entities/location.entity';
import { Category } from '../../common/entities/category.entity';
import { User } from '../user/entities/user.entity';
import { ActivitySortCriteria } from 'src/common/enums/activity-sort-criteria.enum';
import { CommonService } from '../../common/service/common.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivityService extends CommonService<
  Activity,
  CreateActivityDto,
  UpdateActivityDto
> {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {
    super(activityRepository);
  }

  async getActivities(
    userId?: string,
    sortCriteria: ActivitySortCriteria = ActivitySortCriteria.NEWEST,
  ): Promise<Activity[]> {
    let query = this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.isFinished = false');

    if (sortCriteria === ActivitySortCriteria.NEWEST) {
      query = query.orderBy('activity.date', 'ASC');
    } else if (sortCriteria === ActivitySortCriteria.NEAREST) {
      if (!userId) {
        throw new HttpException(
          'User ID is required for nearest sorting',
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['location'],
      });
      if (!user || !user.location) {
        throw new HttpException(
          'User or user location not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const userCoordinates = user.location.coordinates;

      query = query
        .addSelect(
          `ST_Distance(location.coordinates::geography, ST_SetSRID(ST_MakePoint(${userCoordinates}), 4326)::geography)`,
          'distance',
        )
        .leftJoin('activity.location', 'location')
        .orderBy('distance', 'ASC');
    } else if (sortCriteria === ActivitySortCriteria.CUSTOM) {
    }

    return query.getMany();
  }

  async create(createDto: CreateActivityDto): Promise<Activity> {
    const { location, creatorId, category, ...activityData } = createDto;

    const creator = await this.userRepository.findOne({
      where: { id: creatorId },
    });
    if (!creator) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const categoryEntity = await this.categoryRepository.findOne({
      where: { id: category.id },
    });
    if (!categoryEntity) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    const newLocation = this.locationRepository.create(location);
    const savedLocation = await this.locationRepository.save(newLocation);

    const activity = this.activityRepository.create({
      ...activityData,
      location: savedLocation,
      creator,
      category: categoryEntity,
    });

    return await this.activityRepository.save(activity);
  }
}
