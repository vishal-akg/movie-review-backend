import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Actor } from 'src/actors/schemas/actor.schema';
import { Review } from 'src/review/schema/review.schema';
import { MovieGenre } from '../movie.genre';
import { CastRole, CastRoleSchema } from './cast-role.schema';

@Schema()
class CloudFile extends Document {
  @Prop({ required: true })
  public_id: string;

  @Prop({ required: true })
  secure_url: string;
}

const CloudFileSchema = SchemaFactory.createForClass(CloudFile);

@Schema()
class Language extends Document {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  language: string;
}

const LanguageSchema = SchemaFactory.createForClass(Language);

export type MovieDocument = Movie & Document;

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
export class Movie {
  @Prop({
    trim: true,
    required: true,
  })
  title: string;

  @Prop({
    trim: true,
    required: true,
  })
  storyline: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Actor.name })
  director: Actor;

  @Prop({ required: true })
  releaseDate: Date;

  @Prop({
    enum: ['Private', 'Public'],
    required: true,
  })
  status: string;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  genres: MovieGenre[];

  @Prop({ required: true })
  tags: string[];

  @Prop({
    type: [CastRoleSchema],
  })
  cast: CastRole[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Actor.name }],
  })
  writers: Actor[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  })
  reviews: Review[];

  @Prop({
    type: CloudFileSchema,
    required: true,
  })
  poster: CloudFile;

  @Prop({
    type: CloudFileSchema,
    required: true,
  })
  trailer: CloudFile;

  @Prop({ required: true, type: LanguageSchema })
  language: Language;
}

export const MovieSchema = SchemaFactory.createForClass(Movie);
