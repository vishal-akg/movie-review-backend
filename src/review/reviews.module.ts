import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Review, ReviewSchema } from './schema/review.schema';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { MoviesModule } from 'src/movies/movies.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    MoviesModule,
  ],
  providers: [ReviewsService],
  controllers: [ReviewsController],
})
export class ReviewsModule {}
