import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

class CloudFile {
  @IsNotEmpty()
  secure_url: string;

  @IsNotEmpty()
  public_id: string;
}

class Cast {
  @IsMongoId()
  actor: string;

  @IsNotEmpty()
  role: string;

  @IsBoolean()
  lead: boolean;
}

export class CreateMovieDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  storyline: string;

  @IsMongoId()
  director: string;

  @Type(() => Date)
  @IsDate()
  releaseDate: Date;

  @IsNotEmpty()
  type: string;

  @IsArray()
  tags: string[];

  @Type(() => Cast)
  @ValidateNested()
  cast: Cast[];

  @Type(() => CloudFile)
  @ValidateNested()
  poster: CloudFile;

  @Type(() => CloudFile)
  @ValidateNested()
  trailer: CloudFile;

  @IsNotEmpty()
  language: string;

  @IsEnum(['Public', 'Private'])
  status: string;

  @IsArray()
  genres: string[];

  @IsArray()
  writers: string[];
}
