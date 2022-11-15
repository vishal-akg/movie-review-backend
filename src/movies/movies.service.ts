import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import e from 'express';
import mongoose, { Model, ObjectId } from 'mongoose';
import { ActorsService } from 'src/actors/actors.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Review } from 'src/review/schema/review.schema';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Movie, MovieDocument } from './schemas/movie.schema';

@Injectable()
export class MoviesService {
  constructor(
    private cloudinaryService: CloudinaryService,
    @InjectModel(Movie.name) private movieModel: Model<MovieDocument>,
    private actorsService: ActorsService,
  ) {}

  async create(createMovieDto: CreateMovieDto) {
    const movie = new this.movieModel({
      ...createMovieDto,
    });
    await movie.save();
    await Promise.all([
      createMovieDto.cast.forEach(async (cast) => {
        const actor = await this.actorsService.findById(cast.actor);
        await actor.updateOne(
          {
            $addToSet: {
              acted_in: movie.id,
            },
          },
          { overwrite: false },
        );
      }),
      createMovieDto.writers.forEach(async (writer) => {
        const actor = await this.actorsService.findById(writer);
        await actor.updateOne(
          {
            $addToSet: {
              written: movie.id,
            },
          },
          { overwrite: false },
        );
      }),
    ]);

    const director = await this.actorsService.findById(createMovieDto.director);
    await director.updateOne(
      {
        $addToSet: {
          directed: movie.id,
        },
      },
      { overwrite: false },
    );
    return movie;
  }

  async update(movieId: string, updateMovieDto: UpdateMovieDto) {
    const movie = await this.movieModel.findById(movieId);
    if (movie.poster.public_id !== updateMovieDto.poster.public_id) {
      const result = await this.cloudinaryService.deleteImage(
        movie.poster.public_id,
      );
    }

    const updatedMovie = await this.movieModel.findByIdAndUpdate(
      movieId,
      { ...updateMovieDto },
      { new: true, overwrite: false },
    );
    return updatedMovie;
  }

  async getAll({ skip, limit }) {
    const query = this.movieModel
      .find()
      .select('-reviews')
      .populate(['director', 'writers', 'cast.actor'])
      .sort({ _id: -1 })
      .skip(skip);
    if (limit) {
      query.limit(limit);
    }
    return query;
  }

  async count() {
    return this.movieModel.count();
  }

  async search(title: string) {
    return this.movieModel.find({ title: { $regex: title, options: 'i' } });
  }

  async delete(movieId: string) {
    return this.movieModel.findByIdAndDelete(movieId);
  }

  async findById(movieId: string, populate: boolean = false) {
    const query = this.movieModel.findById(movieId);
    if (populate) {
    } else {
      query.select('-reveiws').populate(['director', 'writers', 'cast.actor']);
    }
    return query;
  }

  async getMovieDetails(movieId: string): Promise<any> {
    const movie = await this.movieModel
      .findById(movieId)
      .populate(['director', 'writers', 'cast.actor']);

    const aggregatedRating = await this.getMovieAverageRating(movieId);
    if (aggregatedRating) {
      return {
        ...movie.toJSON(),
        rating: {
          ...aggregatedRating,
        },
      };
    } else {
      return movie;
    }
  }

  async getMovieAverageRating(movieId: string) {
    const [aggregatedRating] = await this.movieModel.aggregate([
      {
        $match: {
          _id: { $eq: new mongoose.Types.ObjectId(movieId) },
        },
      },
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'movie',
          as: 'movie_reviews',
        },
      },
      {
        $unwind: '$movie_reviews',
      },
      {
        $group: {
          _id: null,
          averageRating: {
            $avg: '$movie_reviews.rating',
          },
          reviewCount: {
            $sum: 1,
          },
        },
      },
    ]);

    if (aggregatedRating) {
      return {
        figure: parseFloat(aggregatedRating.averageRating).toFixed(1),
        total: aggregatedRating.reviewCount,
      };
    } else {
      return { figure: 0, total: 0 };
    }
  }

  async getRelatedMovies(movieId: string) {
    const movie = await this.movieModel.findById(movieId);
    const relatedMovies = await this.movieModel.aggregate([
      {
        $match: {
          tags: { $in: [...movie.tags] },
          _id: { $ne: movie._id },
        },
      },
      {
        $addFields: {
          id: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $limit: 5,
      },
    ]);
    return Promise.all(
      relatedMovies.map(async (movie) => {
        const rating = await this.getMovieAverageRating(movie.id.toString());
        console.log(movie);
        return {
          ...movie,
          rating,
        };
      }),
    );
  }

  async getMostRatedMovies(type: string) {
    const typeMatch = type
      ? {
          type: { $eq: type },
        }
      : {};

    const mostRatedMovies = await this.movieModel.aggregate([
      {
        $match: {
          reviews: { $exists: true },
          status: { $eq: 'Public' },
          ...typeMatch,
        },
      },
      {
        $addFields: {
          reviewCount: {
            $size: '$reviews',
          },
        },
      },
      {
        $addFields: {
          id: '$_id',
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
      {
        $sort: {
          reviewCount: -1,
        },
      },
      {
        $limit: 25,
      },
    ]);

    return Promise.all(
      mostRatedMovies.map(async (movie) => {
        const rating = await this.getMovieAverageRating(movie.id.toString());
        return {
          ...movie,
          rating,
        };
      }),
    );
  }

  async latestMovies(limit: number = 5) {
    return this.movieModel
      .find({ status: 'Public' })
      .populate([
        'director',
        'writers',
        {
          path: 'cast',
          populate: {
            path: 'actor',
          },
        },
      ])
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  async getMovieReviews(movieId: string) {
    return this.movieModel.findById(movieId).populate({
      path: 'reviews',
      populate: {
        path: 'owner',
      },
    });
  }
}
