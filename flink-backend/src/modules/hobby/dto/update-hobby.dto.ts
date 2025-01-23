import { IsString, IsOptional, IsUrl } from 'class-validator';
import { validationMessages } from 'src/common/error_messages/validation-messages'; // Adjust the path if needed

export class UpdateHobbyDto {
  @IsOptional()
  @IsString({ message: validationMessages.invalidFormat('Title') })
  title?: string;

  @IsOptional()
  @IsUrl({}, { message: validationMessages.invalidFormat('Photo') })
  photo?: string;
}
