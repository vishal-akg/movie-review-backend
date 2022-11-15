import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import CreateUserDto from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { EmailVerificationDto } from './dto/email-verification.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { EmailVerificationService } from './email-verification.service';
import { JwtAuthGaurd } from './jwt-auth.guard';
import { LocalAuthGuard } from './local-auth.guard';
import { PasswordResetService } from './password-reset.service';
import emailVerificationTemplate from 'src/email/templates/email-verification.template';
import { Public } from './public.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private emailService: EmailService,
    private emailVerificationService: EmailVerificationService,
    private passwordResetService: PasswordResetService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @Public()
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    const { name, isVerified, _id, roles } = req.user;
    const token = await this.authService.login(req.user);
    return {
      user: {
        id: _id,
        name,
        isVerified,
        roles,
      },
      jwt: token,
    };
  }

  @Post('sign-up')
  @Public()
  async singup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    const OTP = await this.emailVerificationService.generate(user);
    await this.emailService.send({
      from: 'verification@movie_app',
      to: user.email,
      subject: 'Email Verification',
      html: emailVerificationTemplate(OTP),
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        isVerified: user.isVerified,
        roles: user.roles,
      },
    };
  }

  @Post('verify-email')
  @HttpCode(200)
  @Public()
  async verifyEmail(@Body() emailVerificationDto: EmailVerificationDto) {
    const user = await this.usersService.findById(emailVerificationDto.userId);
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    if (user.isVerified) {
      throw new HttpException(
        'User is already verified',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isValidToken = await this.emailVerificationService.verify(
      emailVerificationDto,
    );
    if (!isValidToken) {
      throw new HttpException('Token is not valid', HttpStatus.BAD_REQUEST);
    }

    const updatedUser = await this.usersService.setVerified(
      emailVerificationDto.userId,
    );
    const token = await this.authService.login(updatedUser);
    return {
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        isVerified: updatedUser.isVerified,
        roles: updatedUser.roles,
      },
      jwt: token,
    };
  }

  @Post('/resend-email-verification-otp')
  @HttpCode(200)
  async resendEmailVerificationOTP(@Request() req: any) {
    const user = await this.usersService.findById(req.user.sub);
    if (user.isVerified) {
      throw new HttpException(
        'Email is already verified',
        HttpStatus.BAD_REQUEST,
      );
    }

    const OTP = await this.emailVerificationService.generate(user);
    await this.emailService.send({
      from: 'verification@movie_app',
      to: user.email,
      subject: 'Email Verification',
      html: emailVerificationTemplate(OTP),
    });

    return {
      user: {
        id: user._id,
        name: user.name,
        roles: user.roles,
        isVerified: user.isVerified,
      },
    };
  }

  @Post('forgot-password')
  @Public()
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.usersService.findOne(forgotPasswordDto.email);
    if (!user) {
      throw new HttpException(
        'User does not exist with this email',
        HttpStatus.BAD_REQUEST,
      );
    }

    const resetToken = await this.passwordResetService.generate(user);
    if (!resetToken) {
      throw new HttpException(
        'Only after one hour request for another token',
        HttpStatus.BAD_REQUEST,
      );
    }

    const resetPasswordUrl = `http://localhost:3001/auth?token=${resetToken}&id=${user._id}`;
    await this.emailService.send({
      from: 'security@movieapp.com',
      to: user.email,
      subject: 'Reset Password Link',
      html: `
        <p>Click here to reset password</p>
        <a href='${resetPasswordUrl}'>Change Password</a>
      `,
    });
    return { message: 'Password reset link sent to your email' };
  }

  @Post('/reset-password')
  @HttpCode(200)
  @Public()
  async resetPassword(@Body() body: ResetPasswordDto) {
    const isTokenValid =
      await this.passwordResetService.verifyPasswordResetToken(body);
    if (!isTokenValid) {
      throw new HttpException('Token is not valid', HttpStatus.BAD_REQUEST);
    }

    const updatedUser = await this.usersService.updatePassword(
      body.userId,
      body.password,
    );

    const { name, email, _id, roles } = updatedUser;
    const token = await this.authService.login(updatedUser);
    return {
      user: {
        id: _id,
        name,
        email,
        roles,
      },
      jwt: token,
    };
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
