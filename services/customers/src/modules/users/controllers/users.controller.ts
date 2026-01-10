import { Controller, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId')
  findOne(@Param('userId') userId: string) {
    return this.usersService.findOne(userId);
  }

  @Patch(':userId')
  update(@Param('userId') userId: string) {
    return this.usersService.update(userId);
  }

  @Patch(':userId/profile-picture')
  updateProfilePicture(@Param('userId') userId: string) {
    return this.usersService.updateProfilePicture(userId);
  }
}
