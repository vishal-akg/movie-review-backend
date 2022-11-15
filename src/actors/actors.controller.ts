import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Role } from 'src/users/role.enum';
import { Roles } from 'src/users/roles.decorator';
import { PartialType } from '@nestjs/mapped-types';
import { ActorsService } from './actors.service';
import { CreateActorDto } from './dto/create-actor.dto';
import { PaginationParams } from './dto/pagination.params';
import { UpdateActorDto } from './dto/update-actor.dto';
import { AvatarFileDto } from './dto/avatar-file.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { Public } from 'src/auth/public.decorator';

@Controller('actors')
export class ActorsController {
  constructor(
    private actorsService: ActorsService,
    private cloudinaryService: CloudinaryService,
  ) {}

  @Post()
  @Roles(Role.Admin)
  async create(@Body() createActorDto: CreateActorDto) {
    const createdActor = await this.actorsService.create(createActorDto);
    return createdActor;
  }

  @Get()
  async getAll(@Query() { limit, skip }: PaginationParams) {
    const actors = await this.actorsService.findAll({ limit, skip });
    const count = await this.actorsService.count();
    return { actors, count };
  }

  @Get('search')
  async search(@Query('name') name: string) {
    return this.actorsService.search(name);
  }

  @Get(':id')
  @Public()
  async findById(@Param('id') id: string) {
    const actor = await this.actorsService.findById(id);
    if (!actor) {
      throw new HttpException(
        'Actor with this id does not exist',
        HttpStatus.NOT_FOUND,
      );
    }
    return actor;
  }

  @Patch(':id')
  @Roles(Role.Admin)
  async update(
    @Param('id') actorId: string,
    @Body() updateActorDto: UpdateActorDto,
  ) {
    const updatedActor = await this.actorsService.update(
      actorId,
      updateActorDto,
    );
    return updatedActor;
  }

  @Post('/avatar/signature')
  @Roles(Role.Admin)
  async sign(@Body() file: AvatarFileDto) {
    return this.cloudinaryService.signAvatar(file);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') actorId: string) {
    const actor = await this.actorsService.delete(actorId);
    if (!actor) {
      throw new NotFoundException('Actor with this id does not exists.');
    }
    return;
  }

  @Get('latest')
  async getLatest(@Query('limit') limit: number) {
    return this.actorsService.latest(limit);
  }
}
