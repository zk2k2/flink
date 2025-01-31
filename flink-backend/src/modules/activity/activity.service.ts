import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { Location } from '../../common/entities/location.entity';
import { User } from '../user/entities/user.entity';
import { ActivitySortCriteria } from 'src/common/enums/activity-sort-criteria.enum';
import { CommonService } from '../../common/service/common.service';
import { CreateActivityDto } from './dto/create-activity.dto';


@Injectable()
export class ActivityService extends CommonService<Activity> {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    super(activityRepository);
    console.log('ActivityService initialized');
  }

  async getActivities(
    userId?: string,
    sortCriteria: ActivitySortCriteria = ActivitySortCriteria.NEWEST,
  ): Promise<Activity[]> {
    console.log(`getActivities called with userId: ${userId}, sortCriteria: ${sortCriteria}`);

    let query = this.activityRepository
      .createQueryBuilder('activity')
      .where('activity.isFinished = false');

    if (sortCriteria === ActivitySortCriteria.NEWEST) {
      console.log('Sorting by NEWEST');
      query = query.orderBy('activity.date', 'ASC');
      const activities = await query.getMany();
      console.log(`Found ${activities.length} activities sorted by newest`);
      return activities;
    }

    if (sortCriteria === ActivitySortCriteria.NEAREST) {
      console.log('Sorting by NEAREST');
      if (!userId) {
        console.error('User ID missing for nearest sorting');
        throw new HttpException(
          'User ID is required for nearest sorting',
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['location'],
      });
      console.log('Found user:', user?.id);

      if (!user?.location) {
        console.error('User or user location not found');
        throw new HttpException(
          'User or user location not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const userCoords = user.location.coordinates as any;
      console.log('User coordinates:', userCoords);

      if (!userCoords?.coordinates || userCoords.coordinates.length !== 2) {
        console.error('Invalid coordinates format:', userCoords);
        throw new HttpException(
          'Invalid user coordinates format',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const [userLng, userLat] = userCoords.coordinates;
      console.log(`User longitude: ${userLng}, latitude: ${userLat}`);

      const nearestQuery = this.activityRepository
        .createQueryBuilder('activity')
        .leftJoin('activity.location', 'location')
        .addSelect(
          `ST_Distance(
            ST_SetSRID(ST_MakePoint(:userLng, :userLat), 4326)::geography,
            location.coordinates::geography
          )`,
          'distance'
        )
        .where('activity.isFinished = false')
        .orderBy('distance', 'ASC')
        .setParameters({
          userLng: userLng,
          userLat: userLat
        });

      const result = await nearestQuery.getRawAndEntities();
      console.log(`Found ${result.entities.length} activities with distances`);

      // Log distances using raw results
      result.raw.forEach((raw, index) => {
        console.log(`Activity ${result.entities[index].id} distance: ${raw.distance}`);
      });

      return result.entities;
    }

    if (sortCriteria === ActivitySortCriteria.CUSTOM) {
      console.log('Using CUSTOM sorting');
      return await query.getMany();
    }
  }

  async create(createDto: CreateActivityDto): Promise<Activity> {
    console.log('Creating new activity:', createDto);
    const { location, creatorId, ...activityData } = createDto;

    const creator = await this.userRepository.findOne({
      where: { id: creatorId },
    });
    console.log('Found creator:', creator?.id);

    if (!creator) {
      console.error('Creator not found with ID:', creatorId);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const newLocation = this.locationRepository.create(location);
    const savedLocation = await this.locationRepository.save(newLocation);
    console.log('Saved location:', savedLocation.id);

    const activity = this.activityRepository.create({
      ...activityData,
      location: savedLocation,
      creator,
    });

    const savedActivity = await this.activityRepository.save(activity);
    console.log('Successfully created activity:', savedActivity.id);
    return savedActivity;
  }
}