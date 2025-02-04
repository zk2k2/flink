import { SignupDto } from './signup-user.dto';
import { OmitType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Location } from 'src/common/entities/location.entity';
export class UpdateProfileDto extends OmitType(SignupDto, ['location'] as const) {

    @IsOptional()
    @IsObject()
    @ValidateNested()
    @Type(() => Location)
    location? : Location;
}
