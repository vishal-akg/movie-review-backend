import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { UpdateActorDto } from './dto/update-actor.dto';
import { Actor, ActorDocument } from './schemas/actor.schema';

@Injectable()
export class ActorsService {
  constructor(
    @InjectModel(Actor.name) private actorsModel: Model<ActorDocument>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createActorDto: CreateActorDto) {
    const actor = new this.actorsModel({ ...createActorDto });
    return actor.save();
  }

  async findAll({ limit, skip }) {
    const query = this.actorsModel.find().sort({ _id: 1 }).skip(skip);
    if (limit) {
      query.limit(limit);
    }
    return query;
  }

  async count() {
    return this.actorsModel.count();
  }

  async findById(id: string) {
    return this.actorsModel
      .findById(id)
      .populate([
        { path: 'acted_in', populate: [{ path: 'director' }] },
        'directed',
        'written',
      ]);
  }

  async update(actorId: string, updateActorDto: UpdateActorDto) {
    const actor = await this.actorsModel.findById(actorId);
    if (actor.avatar?.public_id !== updateActorDto.avatar.public_id) {
      const result = await this.cloudinaryService.deleteImage(
        actor.avatar.public_id,
      );
    }

    const updatedActor = await this.actorsModel.findByIdAndUpdate(
      actorId,
      {
        ...updateActorDto,
      },
      { new: true, overwrite: false },
    );

    return updatedActor;
  }

  async delete(actorId: string) {
    const actor = await this.actorsModel.findByIdAndDelete(actorId);
    if (actor) {
      if (actor.avatar) {
        await this.cloudinaryService.deleteImage(actor.avatar.public_id);
      }
      return actor;
    }
    return null;
  }

  async search(name: string) {
    return this.actorsModel.find({ $text: { $search: `"${name}"` } });
  }

  async latest(limit: number) {
    return this.actorsModel
      .find({})
      .sort({ createdAt: 'desc' })
      .limit(limit || 12);
  }
}
