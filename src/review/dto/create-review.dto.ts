import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  content: string;

  @IsNumber({ maxDecimalPlaces: 1 })
  @Min(1)
  @Max(10)
  @IsNotEmpty()
  rating: number;
}
