import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Transform } from 'class-transformer';
import { ObjectId, Document } from 'mongoose';
import { Role } from '../role.enum';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform: function (doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      delete ret.password;
      return ret;
    },
  },
})
export class User {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({
    trim: true,
    required: true,
  })
  name: string;

  @Prop({
    trim: true,
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
    length: {
      min: 3,
    },
  })
  @Exclude()
  password: string;

  @Prop({
    required: true,
    default: false,
  })
  isVerified: boolean;

  @Prop({
    default: [Role.User],
    required: true,
  })
  roles: Role[];
}

export const UserSchema = SchemaFactory.createForClass(User);
