import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ActorsModule } from 'src/actors/actors.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { Movie, MovieSchema } from './schemas/movie.schema';

@Module({
  imports: [
    CloudinaryModule,
    ActorsModule,
    MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }]),
  ],
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService],
})
export class MoviesModule {}
