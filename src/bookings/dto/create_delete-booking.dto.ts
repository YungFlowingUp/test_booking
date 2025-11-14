import { IsInt, IsString, IsNotEmpty, Min } from 'class-validator';

export class CreateDeleteBookingDto {
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  eventId: number;

  @IsString()
  @IsNotEmpty()
  userId: string;
}