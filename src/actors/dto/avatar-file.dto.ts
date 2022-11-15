import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class AvatarFileDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: string;

  @IsNumber()
  @IsPositive()
  size: number;
}
