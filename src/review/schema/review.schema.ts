import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { string } from 'joi';
import { Types } from 'mongoose';
import { Movie } from 'src/movies/schemas/movie.schema';
import { User } from 'src/users/schemas/user.schema';

export type ReviewDocument = Review & Document;
@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Review {
  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  owner: User;

  @Prop({ required: true, type: Types.ObjectId, ref: 'Movie' })
  movie: Movie;

  @Prop({ trim: true })
  content: string;

  @Prop({ required: true })
  rating: number;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
ReviewSchema.index({ owner: 1, movie: 1 }, { unique: true });
