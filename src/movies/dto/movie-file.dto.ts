import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class MovieFileDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsPositive()
  size: number;
}
