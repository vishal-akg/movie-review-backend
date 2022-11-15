import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  Length,
  ValidateNested,
} from 'class-validator';

class GenderDto {
  @IsNumber()
  id: number;

  @IsNotEmpty()
  title: string;
}

class AvatarDto {
  @IsNotEmpty()
  public_id: string;

  @IsNotEmpty()
  secure_url: string;
}

class NationalityDto {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  name: string;
}

export class CreateActorDto {
  @IsNotEmpty()
  @Length(3)
  name: string;

  @IsNotEmpty()
  biography: string;

  @Type(() => GenderDto)
  @ValidateNested()
  gender: GenderDto;

  @IsDateString()
  birth: Date;

  @IsNumber()
  awards: number;

  @IsNumber()
  nominations: number;

  @Type(() => AvatarDto)
  @ValidateNested()
  avatar: AvatarDto;

  @Type(() => NationalityDto)
  @ValidateNested()
  nationality: NationalityDto;
}
