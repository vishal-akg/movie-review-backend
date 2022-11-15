import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  EmailVerificationToken,
  EmailVerificationTokenDocument,
} from './schemas/email-verification-token.schema';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(user: any) {
    const payload = { email: user.email, sub: user._id, roles: user.roles };
    return this.jwtService.sign(payload);
  }
}
