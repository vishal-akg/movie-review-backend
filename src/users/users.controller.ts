import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGaurd } from 'src/auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  @UseGuards(JwtAuthGaurd)
  async me(@Request() req) {
    return this.usersService.findById(req.user.sub);
  }
}
