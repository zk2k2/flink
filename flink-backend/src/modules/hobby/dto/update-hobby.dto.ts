import { IsString, IsOptional, IsUrl } from 'class-validator';
import { validationMessages } from 'src/common/error_messages/validation-messages';

export class UpdateHobbyDto {
  @IsOptional()
  @IsString({ message: validationMessages.invalidFormat('Title') })
  title: string;
}
