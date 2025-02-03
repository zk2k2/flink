import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateHobbyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  photo: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
