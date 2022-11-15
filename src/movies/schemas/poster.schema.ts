import { Prop, SchemaFactory } from '@nestjs/mongoose';

export type PosterDocument = Poster & Document;

export class Poster {
  @Prop({ required: true })
  public_id: string;

  @Prop({ required: true })
  secure_url: string;
}

export const PosterSchema = SchemaFactory.createForClass(Poster);
