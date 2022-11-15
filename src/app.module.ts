import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import * as Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { ActorsModule } from './actors/actors.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './users/roles.guard';
import { JwtAuthGaurd } from './auth/jwt-auth.guard';
import { MoviesModule } from './movies/movies.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { ReviewsModule } from './review/reviews.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development.local'],
      validationSchema: Joi.object({
        MONGO_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        NODEMAILER_HOST: Joi.string().required(),
        NODEMAILER_PORT: Joi.number().required(),
        NODEMAILER_USER: Joi.string().required(),
        NODEMAILER_PASS: Joi.string().required(),
      }),
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        console.log(configService.get<string>('MONGO_URI'));
        return {
          uri: configService.get<string>('MONGO_URI'),
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    EmailModule,
    ActorsModule,
    CloudinaryModule,
    MoviesModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGaurd },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
