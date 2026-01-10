import { Body, Controller, Param, Patch, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { UpdateProfilePictureDTO } from '../dto/updateProfilePicture.dto';
import { UpdateUserDTO } from '../dto/updateUser.dto';
import { updateProfilePictureSchema } from '../schemas/updateProfilePicture.schema';
import { updateUserSchema } from '../schemas/updateUser.schema';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch(':userId')
  @UsePipes(new ZodValidationPipe(updateUserSchema))
  update(@Param('userId') userId: string, @Body() updateUserDto: UpdateUserDTO) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Patch(':userId/profile-picture')
  @UsePipes(new ZodValidationPipe(updateProfilePictureSchema))
  updateProfilePicture(
    @Param('userId') userId: string,
    @Body() updateProfilePictureDto: UpdateProfilePictureDTO,
  ) {
    return this.usersService.updateProfilePicture(userId, updateProfilePictureDto);
  }
}
