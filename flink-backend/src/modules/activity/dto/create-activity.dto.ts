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
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ActivityConditions } from '../../../common/enums/activity-conditions.enum';
import { ActivityTypes } from '../../../common/enums/activity-types.enum';
import { LocationDto } from '../../../common/dto/location-dto';
import { Category } from '../../../common/entities/category.entity';
import { validationMessages } from '../../../common/error_messages/validation-messages';
import { MinLength, MaxLength } from 'class-validator';

export class CreateActivityDto {
  @IsNotEmpty({ message: validationMessages.required('Title') })
  @IsString({ message: validationMessages.invalidFormat('Title') })
  @MinLength(3, { message: validationMessages.minLength('Title', 3) })
  @MaxLength(20, { message: validationMessages.maxLength('Title', 20) })
  title: string;

  @IsNotEmpty({ message: validationMessages.required('Date') })
  @IsDate({ message: validationMessages.invalidFormat('Date') })
  @Type(() => Date)
  date: Date;

  @IsNotEmpty({ message: validationMessages.required('Description') })
  @IsString({ message: validationMessages.invalidFormat('Description') })
  @MinLength(10, { message: validationMessages.minLength('Description', 10) })
  @MaxLength(500, { message: validationMessages.maxLength('Description', 100) })
  description: string;

  @IsNotEmpty({ message: validationMessages.required('Type') })
  @IsEnum(ActivityTypes, { message: validationMessages.invalidFormat('Type') })
  type: ActivityTypes;

  @IsArray({ message: validationMessages.invalidFormat('Activity Photos') })
  @IsString({
    each: true,
    message: validationMessages.invalidFormat('Activity Photos'),
  })
  @IsOptional()
  activityPhotos: string[];

  @IsNotEmpty({ message: validationMessages.required('Conditions') })
  @IsEnum(ActivityConditions, {
    message: validationMessages.invalidFormat('Conditions'),
  })
  conditions: ActivityConditions;

  @IsNotEmpty({
    message: validationMessages.required('Number of Participants'),
  })
  @IsInt({
    message: validationMessages.invalidFormat('Number of Participants'),
  })
  @Min(1, { message: validationMessages.min('Number of Participants', 1) })
  @Max(100, { message: validationMessages.max('Number of Participants', 100) })
  nbOfParticipants: number;

  @IsNotEmpty({ message: validationMessages.required('Creator ID') })
  @IsUUID('4', { message: validationMessages.invalidFormat('Creator ID') })
  creatorId: string;

  @IsNotEmpty({ message: validationMessages.required('Location') })
  @IsObject({ message: validationMessages.invalidFormat('Location') })
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;

  @IsNotEmpty({ message: validationMessages.required('Category') })
  @ValidateNested()
  @Type(() => Category)
  category: Category;
}
