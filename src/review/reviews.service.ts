import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MoviesService } from 'src/movies/movies.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review, ReviewDocument } from './schema/review.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    private moviesService: MoviesService,
  ) {}

  async create(
    movieId: string,
    userId: string,
    createReviewDto: CreateReviewDto,
  ) {
    const movie = await this.moviesService.findById(movieId);
    if (movie) {
      const review = new this.reviewModel({
        owner: userId,
        movie: movie,
        ...createReviewDto,
      });
      await review.save();
      await movie.updateOne({ $addToSet: { reviews: review } });
      return review.populate('owner');
    }
    return null;
  }

  async update(
    reviewId: string,
    userId: string,
    updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewModel
      .findOneAndUpdate(
        { _id: reviewId, owner: userId },
        { ...updateReviewDto },
        { new: true, overwrite: false },
      )
      .populate('owner');
  }

  async delete(movieId: string, reviewId: string, userId: string) {
    const review = await this.reviewModel.findOne({
      _id: reviewId,
      owner: userId,
    });
    if (review) {
      const movie = await this.moviesService.findById(movieId);
      const updatedMovie = await movie.updateOne({
        $pull: { reviews: review.id },
      });
      const res = review.populate('owner');
      await review.delete();
      return res;
    }
    return null;
  }
}
