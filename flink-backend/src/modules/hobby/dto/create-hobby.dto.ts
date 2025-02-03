import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateHobbyDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsUUID()
  @IsNotEmpty()
  categoryId: string;
}
