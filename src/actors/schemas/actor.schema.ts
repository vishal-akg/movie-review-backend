import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import mongoose, { Document } from 'mongoose';
import { Movie } from 'src/movies/schemas/movie.schema';

@Schema()
export class Avatar extends Document {
  @Prop({ required: true })
  secure_url: string;

  @Prop({ required: true })
  public_id: string;
}

export const AvatarSchema = SchemaFactory.createForClass(Avatar);

@Schema()
class Nationality extends Document {
  @Prop({ required: true })
  code: string;

  @Prop({ required: true })
  name: string;
}

const NationalitySchema = SchemaFactory.createForClass(Nationality);

@Schema()
class Gender extends Document {
  @Prop({ required: true })
  id: number;

  @Prop({ required: true })
  title: string;
}

const GenderSchema = SchemaFactory.createForClass(Gender);

export type ActorDocument = Actor & Document;

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
export class Actor {
  @Prop({
    trim: true,
    required: true,
  })
  name: string;

  @Prop({
    trim: true,
    required: true,
  })
  biography: string;

  @Prop({
    type: GenderSchema,
    required: true,
  })
  gender: Gender;

  @Prop({ type: NationalitySchema, required: true })
  nationality: Nationality;

  @Prop({ type: AvatarSchema })
  avatar: Avatar;

  @Prop({ required: true })
  birth: Date;

  @Prop({ default: 0 })
  awards: number;

  @Prop({ default: 0 })
  nominations: 0;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }] })
  directed: Movie[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }] })
  acted_in: Movie[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }] })
  written: Movie[];
}

export const ActorSchema = SchemaFactory.createForClass(Actor);
