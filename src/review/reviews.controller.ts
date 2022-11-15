import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Public } from 'src/auth/public.decorator';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';

@Controller('/movies/:id/reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Post()
  async create(
    @Param('id') movieId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Req() req: any,
  ) {
    try {
      const review = await this.reviewsService.create(
        movieId,
        req.user.sub,
        createReviewDto,
      );
      return review;
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException('You have already reviewed this movie');
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  @Patch(':reviewId')
  async update(
    @Param('reviewId') reviewId: string,
    @Req() req: any,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return this.reviewsService.update(reviewId, req.user.sub, updateReviewDto);
  }

  @Delete(':reviewId')
  async delete(
    @Param('id') movieId: string,
    @Param('reviewId') reviewId: string,
    @Req() req: any,
  ) {
    return this.reviewsService.delete(movieId, reviewId, req.user.sub);
  }
}
