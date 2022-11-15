import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/schemas/user.schema';

export type PasswordResetTokenDocument = PasswordResetToken & Document;

@Schema()
export class PasswordResetToken {
  @Prop({
    required: true,
  })
  token: string;

  @Prop({
    expires: 3600,
    default: Date.now,
  })
  createdAt: Date;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: User.name,
    required: true,
  })
  owner: User;
}

export const PasswordResetTokenSchema =
  SchemaFactory.createForClass(PasswordResetToken);

PasswordResetTokenSchema.pre('save', async function (next) {
  if (this.isModified('token')) {
    const hashedToken = await bcrypt.hash(this.token, 10);
    this.set('token', hashedToken);
  }
  next();
});
