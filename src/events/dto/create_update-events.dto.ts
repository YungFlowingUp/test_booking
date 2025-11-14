import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class CreateUpdateEventsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  @Min(1)
  @Max(5000)
  totalSeats: number;
}
