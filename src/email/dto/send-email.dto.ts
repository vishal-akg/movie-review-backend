import { IsNotEmpty } from 'class-validator';

export class SendEmailDto {
  @IsNotEmpty()
  from: string;

  @IsNotEmpty()
  to: string;

  @IsNotEmpty()
  subject: string;

  @IsNotEmpty()
  html: string;
}
