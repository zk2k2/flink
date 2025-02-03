import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { Location } from '../../common/entities/location.entity';

import { ActivitySortCriteria } from 'src/common/enums/activity-sort-criteria.enum';
import { CommonService } from '../../common/service/common.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UserService } from '../user/user.service';
import { CategoryService } from '../category/category.service';

@Injectable()
export class ActivityService extends CommonService<Activity> {
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
    private readonly userService: UserService,
    private readonly categoryservice: CategoryService,

  ) {
    super(activityRepository);
  }

  async getActivities(
    userId: string,
    sortCriteria: ActivitySortCriteria = ActivitySortCriteria.NEWEST,
    activityType: 'feed' | 'profile',
    timeFrame?: 'past' | 'recent',
    creatorId?: string
  ): Promise<Activity[]> {
    let query = this.activityRepository
      .createQueryBuilder('activity');

    if (activityType === 'feed') {
      query = query.andWhere('activity.creatorId != :userId', { userId });

      if (creatorId) {
        query = query.andWhere('activity.creatorId = :creatorId', { creatorId });
      }
    } else if (activityType === 'profile') {
      query = query.andWhere('activity.creatorId = :userId', { userId });

      if (timeFrame === 'past') {
        query = query.andWhere('activity.date < CURRENT_TIMESTAMP');
      } else if (timeFrame === 'recent' || !timeFrame) {
        query = query.andWhere('activity.date >= CURRENT_TIMESTAMP');
      }
    }

    if (sortCriteria === ActivitySortCriteria.NEWEST) {
      query = query.orderBy('activity.createdAt', 'DESC');
    } else if (sortCriteria === ActivitySortCriteria.NEAREST) {
      console.log('Sorting by NEAREST');
      if (!userId) {
        console.error('User ID missing for nearest sorting');
        throw new HttpException(
          'User ID is required for nearest sorting',
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this.userService.findOne({
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
        .orderBy('distance', 'ASC')
        .setParameters({
          userLng: userLng,
          userLat: userLat
        });

      const result = await nearestQuery.getRawAndEntities();
      console.log(`Found ${result.entities.length} activities with distances`);

      result.raw.forEach((raw, index) => {
        console.log(`Activity ${result.entities[index].id} distance: ${raw.distance}`);
      });

      return result.entities;
    } else if (sortCriteria === ActivitySortCriteria.CUSTOM) {
      const user = await this.userService.findOne({
        where: { id: userId },
        relations: ['location', 'userHobbies'],
      });

      if (!user?.location) {
        throw new HttpException('User or user location not found', HttpStatus.NOT_FOUND);
      }

      const userCoords = user.location.coordinates as any;
      const [userLng, userLat] = userCoords.coordinates;
      query = query
        .leftJoin('activity.location', 'location')
        .leftJoin('activity.category', 'category')
        .addSelect(
          `ST_Distance(
          ST_SetSRID(ST_MakePoint(:userLng, :userLat), 4326)::geography,
          location.coordinates::geography
        ) + 1`,
          'distance'
        )
        .addSelect(
          `EXP(
        (SELECT COALESCE(SUM(uh."interestLevel"), 0)
         FROM user_hobby uh
         JOIN hobby h ON uh."hobbyId" = h.id
         WHERE uh."userId" = :userId
         AND h."categoryId" = activity."categoryId"
        ) - (0.5 * LN(ST_Distance(
          ST_SetSRID(ST_MakePoint(:userLng, :userLat), 4326)::geography,
          location.coordinates::geography
        ) + 1) / LN(2))
      )`,
          'score'
        )
        .orderBy('score', 'DESC')
        .setParameters({ userLng, userLat, userId });
    }
    const result = await query.getRawAndEntities();
    console.log(`Found ${result.entities.length} activities with scores`);
    result.raw.forEach((raw, index) => {
      console.log(`Activity ${result.entities[index].id} score: ${raw.score}`);
    });
    return await query.getMany();
  }

  async createActivity(creatorId: string, createDto: CreateActivityDto): Promise<Activity> {
    const { location, categoryName, ...activityData } = createDto;


    const creator = await this.userService.findOne({
      where: { id: creatorId },
    });

    if (!creator) {
      console.error('Creator not found with ID:', creatorId);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const categoryEntity = await this.categoryservice.findByField('name', categoryName);

    if (!categoryEntity) {
      throw new HttpException('Category not found', HttpStatus.NOT_FOUND);
    }

    const savedLocation = await this.userService.createLocation(location);

    creator.xp += 200;
    await this.userService.update(creatorId, creator);

    return this.create({
      ...activityData,
      location: savedLocation,
      creator,
      category: categoryEntity,
      users: [creator],
    });
  }

  async joinActivity(userId: string, activityId: string): Promise<Activity> {
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const activity = await this.findOne({
      where: { id: activityId },
      relations: ['users'],
    });

    if (!activity) {
      throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
    }

    if (!activity.users.some(u => u.id === userId) && activity.users.length < activity.nbOfParticipants) {
      activity.users.push(user);
      user.xp += 100;
    }

    await this.activityRepository.save(activity);
    await this.userService.update(userId, user);
    return activity;
  }

  async leaveActivity(userId: string, activityId: string): Promise<Activity> {
    const user = await this.userService.findOneById(userId);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const activity = await this.findOne({
      where: { id: activityId },
      relations: ['users'],
    });

    if (!activity) {
      throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
    }

    if (activity.users.some(u => u.id === userId)) {
      activity.users = activity.users.filter(u => u.id !== userId);
      user.xp -= 100;
    }

    await this.activityRepository.save(activity);
    await this.userService.update(userId, user);
    return activity;
  }

  async deleteActivity(userId: string, activityId: string): Promise<void> {
    const activity = await this.findOne({
      where: { id: activityId },
      relations: ['creator'],
    });

    if (!activity) {
      throw new HttpException('Activity not found', HttpStatus.NOT_FOUND);
    }

    if (activity.creator.id !== userId) {
      throw new HttpException('User is not the creator of the activity', HttpStatus.UNAUTHORIZED);
    }

    const creator = activity.creator;
    creator.xp -= 200;
    await this.userService.update(creator.id, creator);

    await this.remove(activityId);
  }

}