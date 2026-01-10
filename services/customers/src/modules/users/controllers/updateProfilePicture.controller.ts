import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { JwtAuthGuard } from '../../../infrastructure/auth/jwt-auth.guard';
import { UpdateProfilePictureDTO } from '../dto/updateProfilePicture.dto';
import { updateProfilePictureSchema } from '../schemas/updateProfilePicture.schema';
import { UpdateProfilePictureService } from '../services/updateProfilePicture.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UpdateProfilePictureController {
  constructor(private readonly updateProfilePictureService: UpdateProfilePictureService) {}

  @Patch(':userId/profile-picture')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateProfilePictureSchema))
  execute(@Param('userId', ParseUUIDPipe) userId: string, @Body() data: UpdateProfilePictureDTO) {
    return this.updateProfilePictureService.execute(userId, data);
  }
}
