import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import CreateUserDto from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findOne(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<User> {
    return this.userModel.findById(id);
  }

  async setVerified(userId: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          isVerified: true,
        },
      },
      { new: true, overwrite: false },
    );
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const createdUser = new this.userModel(createUserDto);
      console.log(createUserDto);
      return await createdUser.save();
    } catch (error) {
      if (error?.code === 11000) {
        throw new HttpException(
          'User with this email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      console.log(error);
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updatePassword(userId: string, password: string) {
    return this.userModel.findByIdAndUpdate(
      userId,
      {
        $set: {
          password,
        },
      },
      { new: true, overwrite: false },
    );
  }
}
