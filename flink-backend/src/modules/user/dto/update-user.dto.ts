import { SignupDto } from './signup-user.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProfileDto extends PartialType(SignupDto) {
}
