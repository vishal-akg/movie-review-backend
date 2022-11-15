import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { SendEmailDto } from './dto/send-email.dto';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}

  async send(sendEmail: SendEmailDto) {
    await this.mailerService.sendMail(sendEmail);
  }
}
