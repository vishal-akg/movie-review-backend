import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserSchema } from './schemas/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailVerificationToken } from '../auth/schemas/email-verification-token.schema';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre('save', async function () {
            if (this.isModified('password')) {
              const hashedPassword = await bcrypt.hash(this.password, 10);
              this.password = hashedPassword;
            }
          });
          return schema;
        },
      },
    ]),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
