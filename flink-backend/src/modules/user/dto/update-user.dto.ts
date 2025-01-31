import { SignupDto } from './signup-user.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString } from 'class-validator';
export class UpdateProfileDto extends PartialType(SignupDto) {
    @IsOptional()
    @IsString()
    refreshToken?: string; 
}
