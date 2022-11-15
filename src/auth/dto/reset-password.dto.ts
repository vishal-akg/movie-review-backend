import { IsNotEmpty } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  password: string;
}
