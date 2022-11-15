import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/schemas/user.schema';

export type EmailVerificationTokenDocument = EmailVerificationToken & Document;

@Schema()
export class EmailVerificationToken {
  @Prop({
    required: true,
  })
  token: string;

  @Prop({
    expires: '12m',
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

export const EmailVerificationTokenSchema = SchemaFactory.createForClass(
  EmailVerificationToken,
);

EmailVerificationTokenSchema.pre('save', async function (next) {
  if (this.isModified('token')) {
    const hashedToken = await bcrypt.hash(this.token, 10);
    this.set('token', hashedToken);
  }
  next();
});
