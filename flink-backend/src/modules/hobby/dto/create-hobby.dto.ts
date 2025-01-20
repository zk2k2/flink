import { IsString, IsNotEmpty } from 'class-validator';

export class CreateHobbyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  photo: string;
}
