import {
  IsString,
  IsEmail,
  IsDate,
  IsOptional,
  IsArray,
  IsPhoneNumber,
  IsNotEmpty,
  IsAlpha,
  Matches,
  MinLength,
  MaxLength,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserHobby } from '../../hobby/entities/user-hobby.entity';
import { validationMessages } from 'src/common/error_messages/validation-messages';
import { LocationDto } from 'src/common/dto/location-dto';

export class SignupDto {
  @IsString({ message: validationMessages.invalidFormat('Name') })
  @IsNotEmpty({ message: validationMessages.required('Name') })
  @IsAlpha(undefined, { message: validationMessages.isAlpha('Name') })
  name: string;

  @IsString({ message: validationMessages.invalidFormat('Username') })
  @IsNotEmpty({ message: validationMessages.required('Username') })
  @MinLength(3, { message: validationMessages.minLength('Username', 3) })
  @MaxLength(20, { message: validationMessages.maxLength('Username', 20) })
  username: string;

  @IsEmail({}, { message: validationMessages.isEmail() })
  @IsNotEmpty({ message: validationMessages.required('Email') })
  email: string;

  @IsPhoneNumber('TN', { message: validationMessages.isPhoneNumber() })
  @IsNotEmpty({ message: validationMessages.required('Phone number') })
  phone: string;

  @IsString({ message: validationMessages.invalidFormat('Password') })
  @IsNotEmpty({ message: validationMessages.required('Password') })
  @MinLength(8, { message: validationMessages.minLength('Password', 8) })
  @Matches(/^(?=.*\d)(?=.*[A-Z])(?=.*\W).+$/, {
    message: validationMessages.password(),
  })
  password: string;

  @IsDate({ message: validationMessages.invalidFormat('Birthdate') })
  @IsNotEmpty({ message: validationMessages.required('Birthdate') })
  @Type(() => Date)
  birthDate: Date;

  @IsOptional()
  @IsString({ message: validationMessages.invalidFormat('Profile picture') })
  profilePic: string;

  @IsArray({ message: validationMessages.invalidFormat('User hobbies') })
  @ValidateNested({ each: true })
  @Type(() => UserHobby)
  @IsNotEmpty({ message: validationMessages.required('User hobbies') })
  userHobbies: UserHobby[];

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
