import { IsString, IsNumber, Min, IsUUID } from 'class-validator';

export class CreateUserHobbiesDto {
  @IsUUID()
  @IsString()
  hobbyId: string;

  @IsNumber()
  @Min(1)
  interestLevel: number;
}
