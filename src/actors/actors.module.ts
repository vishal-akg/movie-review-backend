import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Actor, ActorSchema } from './schemas/actor.schema';
import { ActorsService } from './actors.service';
import { ActorsController } from './actors.controller';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';

@Module({
  imports: [
    CloudinaryModule,
    MongooseModule.forFeatureAsync([
      {
        name: Actor.name,
        useFactory: () => {
          const schema = ActorSchema;
          schema.index({ name: 'text' });
          return schema;
        },
      },
    ]),
  ],
  providers: [ActorsService],
  controllers: [ActorsController],
  exports: [ActorsService],
})
export class ActorsModule {}
