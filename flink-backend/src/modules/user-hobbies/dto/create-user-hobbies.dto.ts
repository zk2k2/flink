import { IsString, IsNumber, Min} from 'class-validator';

export class CreateUserHobbiesDto {
  @IsString()
  title: string;

  @IsNumber()
  @Min(1)
  interestLevel: number;
}
