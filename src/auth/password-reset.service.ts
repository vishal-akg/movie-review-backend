import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { generateRandomBytes } from 'src/utils/helper';
import { ResetPasswordDto } from './dto/reset-password.dto';

import {
  PasswordResetToken,
  PasswordResetTokenDocument,
} from './schemas/password-reset-token.schema';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectModel(PasswordResetToken.name)
    private passwordResetToken: Model<PasswordResetTokenDocument>,
  ) {}

  async generate(user: any) {
    const existingToken = await this.passwordResetToken.findOne({
      owner: user._id,
    });
    if (!existingToken) {
      const token = await generateRandomBytes();
      const resetToken = new this.passwordResetToken({
        owner: user._id,
        token,
      });
      await resetToken.save();
      return token;
    }
    return null;
  }

  async verifyPasswordResetToken(resetPasswordDto: ResetPasswordDto) {
    const resetToken = await this.passwordResetToken.findOne({
      owner: resetPasswordDto.userId,
    });
    if (
      resetToken &&
      (await bcrypt.compare(resetPasswordDto.token, resetToken.token))
    ) {
      return resetToken;
    }
    return null;
  }
}
