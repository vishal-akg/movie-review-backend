import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as otpGenerator from 'otp-generator';
import * as bcrypt from 'bcrypt';
import { EmailVerificationDto } from './dto/email-verification.dto';
import {
  EmailVerificationToken,
  EmailVerificationTokenDocument,
} from './schemas/email-verification-token.schema';

@Injectable()
export class EmailVerificationService {
  constructor(
    @InjectModel(EmailVerificationToken.name)
    private emailVerificationToken: Model<EmailVerificationTokenDocument>,
  ) {}

  async generate(user: any) {
    const OTP = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const verificationToken = await this.emailVerificationToken.findOne({
      owner: user._id,
    });
    if (verificationToken) {
      verificationToken.token = OTP;
      await verificationToken.save();
    } else {
      await this.emailVerificationToken.create({ owner: user._id, token: OTP });
    }
    return OTP;
  }

  async verify(emailVerificationDto: EmailVerificationDto): Promise<boolean> {
    const token = await this.emailVerificationToken.findOne({
      owner: emailVerificationDto.userId,
    });
    console.log(token, emailVerificationDto.OTP);
    if (
      !!token &&
      (await bcrypt.compare(emailVerificationDto.OTP, token.token))
    ) {
      return true;
    }
    return null;
  }
}
