import { SignupDto } from '../modules/user/dto/signup-user.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateProfileDto extends PartialType(SignupDto) {
}
