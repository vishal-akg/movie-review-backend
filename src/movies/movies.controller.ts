import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataRequest } from 'nestjs-form-data';
import { Public } from 'src/auth/public.decorator';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Role } from 'src/users/role.enum';
import { Roles } from 'src/users/roles.decorator';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieFileDto } from './dto/movie-file.dto';
import { PaginationParams } from './dto/pagination.params';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(
    private moviesService: MoviesService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createMovieDto: CreateMovieDto) {
    const createdMovie = await this.moviesService.create(createMovieDto);
    return createdMovie;
  }

  @Patch(':id')
  @Roles(Role.Admin)
  async update(
    @Param('id') movieId: string,
    @Body() updateMovieDto: UpdateMovieDto,
  ) {
    const updatedMovie = await this.moviesService.update(
      movieId,
      updateMovieDto,
    );
    return updatedMovie;
  }

  @Delete(':id')
  @Roles(Role.Admin)
  async delete(@Param('id') movieId: string) {
    return { message: 'successfully deleted!' };
    // const deletedMovie = await this.moviesService.delete(movieId);
    // if (!deletedMovie) {
    //   throw new NotFoundException('movie does not exist with this id');
    // }
    // return deletedMovie;
  }

  @Post('signature')
  @Roles(Role.Admin)
  async sign(@Body() file: MovieFileDto) {
    return this.cloudinaryService.sign(file);
  }

  @Get()
  async getAll(@Query() { limit, skip }: PaginationParams) {
    const movies = await this.moviesService.getAll({ skip, limit });
    const count = await this.moviesService.count();
    return { movies, count };
  }

  @Get('latest')
  @Public()
  async getLatestMovies(@Query('limit') limit: number) {
    return this.moviesService.latestMovies(limit);
  }

  @Get('search')
  async search(@Query('title') title: string) {
    return this.moviesService.search(title);
  }

  @Get('most-rated')
  @Public()
  async getMostRated(@Query('type') type: string) {
    return this.moviesService.getMostRatedMovies(type);
  }

  @Get(':id/reviews')
  @Public()
  async getAllReviews(@Param('id') movieId: string) {
    return this.moviesService.getMovieReviews(movieId);
  }

  @Get(':id/details')
  @Public()
  async getMovieDetails(@Param('id') movieId: string) {
    return this.moviesService.getMovieDetails(movieId);
  }

  @Get(':id/related-movies')
  @Public()
  async getRelatedMovies(@Param('id') movieId: string) {
    return this.moviesService.getRelatedMovies(movieId);
  }
}
