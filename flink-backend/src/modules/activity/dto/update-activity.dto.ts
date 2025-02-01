import {
  IsOptional,
  IsString,
  IsDate,
  IsEnum,
  IsArray,
  IsInt,
  IsUUID,
  ValidateNested,
  IsObject,
  Min,
  Max,
} from 'class-validator';

import { Type } from 'class-transformer';
import { ActivityConditions } from '../../../common/enums/activity-conditions.enum';
import { LocationDto } from '../../../common/dto/location-dto';
import { validationMessages } from '../../../common/error_messages/validation-messages';
import { MinLength, MaxLength } from 'class-validator';
import { Category } from '../../../common/entities/category.entity';

export class UpdateActivityDto {
  @IsOptional()
  @IsString({ message: validationMessages.invalidFormat('Title') })
  @MinLength(3, { message: validationMessages.minLength('Title', 3) })
  @MaxLength(100, { message: validationMessages.maxLength('Title', 20) })
  title?: string;

  @IsOptional()
  @IsDate({ message: validationMessages.invalidFormat('Date') })
  @Type(() => Date)
  date?: Date;

  @IsOptional()
  @IsString({ message: validationMessages.invalidFormat('Description') })
  @MinLength(10, { message: validationMessages.minLength('Description', 10) })
  @MaxLength(500, { message: validationMessages.maxLength('Description', 100) })
  description?: string;

  @IsOptional()
  @IsArray({ message: validationMessages.invalidFormat('Activity Photos') })
  @IsString({
    each: true,
    message: validationMessages.invalidFormat('Activity Photos'),
  })
  activityPhotos?: string[];

  @IsOptional()
  @IsEnum(ActivityConditions, {
    message: validationMessages.invalidFormat('Conditions'),
  })
  conditions?: ActivityConditions;

  @IsOptional()
  @IsInt({
    message: validationMessages.invalidFormat('Number of Participants'),
  })
  @Min(1, { message: validationMessages.min('Number of Participants', 1) })
  @Max(100, { message: validationMessages.max('Number of Participants', 100) })
  nbOfParticipants?: number;

  @IsOptional()
  @IsUUID('4', { message: validationMessages.invalidFormat('Creator ID') })
  creatorId?: string;

  @IsOptional()
  @IsObject({ message: validationMessages.invalidFormat('Location') })
  @ValidateNested()
  @Type(() => LocationDto)
  location?: LocationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => Category)
  category: Category;
}
