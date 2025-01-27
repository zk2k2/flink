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
  IsObject,
  IsJWT,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { validationMessages } from 'src/common/error_messages/validation-messages';
import { LocationDto } from 'src/common/dto/location-dto';
import { CreateUserHobbiesDto } from 'src/modules/hobby/dto/create-user-hobbies.dto';

export class SignupDto {
  @IsString({ message: validationMessages.invalidFormat('First Name') })
  @IsNotEmpty({ message: validationMessages.required('First Name') })
  @IsAlpha(undefined, { message: validationMessages.isAlpha('First Name') })
  firstName: string;


  @IsString({ message: validationMessages.invalidFormat('Last Name') })
  @IsNotEmpty({ message: validationMessages.required('Last Name') })
  @IsAlpha(undefined, { message: validationMessages.isAlpha('Last Name') })
  lastName: string;


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
  @Type(() => CreateUserHobbiesDto)
  @IsNotEmpty({ message: validationMessages.required('User hobbies') })
  hobbies: CreateUserHobbiesDto[];

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}
