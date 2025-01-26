import {
  IsNotEmpty,
  IsString,
  IsDate,
  IsEnum,
  IsArray,
  IsInt,
  IsUUID,
  ValidateNested,
  IsObject,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ActivityConditions } from '../../../common/enums/activity-conditions.enum';
import { ActivityTypes } from '../../../common/enums/activity-types.enum';
import { LocationDto } from '../../../common/dto/location-dto';

export class CreateActivityDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsDate()
  date: Date;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(ActivityTypes)
  type: ActivityTypes;

  @IsArray()
  @IsString({ each: true })
  activityPhotos: string[];

  @IsNotEmpty()
  @IsEnum(ActivityConditions)
  conditions: ActivityConditions;

  @IsNotEmpty()
  @IsInt()
  nbOfParticipants: number;

  @IsNotEmpty()
  @IsUUID()
  creatorId: string;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
