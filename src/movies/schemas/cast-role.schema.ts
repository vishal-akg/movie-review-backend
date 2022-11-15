import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Actor } from 'src/actors/schemas/actor.schema';

export type CastRoleDocument = CastRole & Document;

@Schema()
export class CastRole {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Actor.name })
  actor: Actor;

  @Prop()
  role: string;

  @Prop()
  lead: boolean;
}

export const CastRoleSchema = SchemaFactory.createForClass(CastRole);
