import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { createTransport } from 'nodemailer';
import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          secure: false,
          host: configService.get<string>('NODEMAILER_HOST'),
          port: +configService.get<string>('NODEMAILER_PORT'),
          auth: {
            user: configService.get<string>('NODEMAILER_USER'),
            pass: configService.get<string>('NODEMAILER_PASS'),
          },
        },
      }),
    }),
  ],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
