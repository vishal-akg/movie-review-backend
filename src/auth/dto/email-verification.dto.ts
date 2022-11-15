import { IsNotEmpty, IsNumber } from 'class-validator';

export class EmailVerificationDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  OTP: string;
}
