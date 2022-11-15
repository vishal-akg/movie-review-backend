import { Module } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import {
  EmailVerificationToken,
  EmailVerificationTokenSchema,
} from './schemas/email-verification-token.schema';
import { EmailModule } from 'src/email/email.module';
import { EmailVerificationService } from './email-verification.service';
import { PasswordResetService } from './password-reset.service';
import {
  PasswordResetToken,
  PasswordResetTokenSchema,
} from './schemas/password-reset-token.schema';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    EmailModule,
    MongooseModule.forFeature([
      {
        name: EmailVerificationToken.name,
        schema: EmailVerificationTokenSchema,
      },
      {
        name: PasswordResetToken.name,
        schema: PasswordResetTokenSchema,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    EmailVerificationService,
    PasswordResetService,
    LocalStrategy,
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
