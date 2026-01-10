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
import { JwtAuthGuard } from '../../../infrastructure/auth/guards/jwt-auth.guard';
import { OwnershipGuard } from '../../../infrastructure/auth/guards/ownership.guard';
import { UpdateProfilePictureDTO } from '../dto/updateProfilePicture.dto';
import { updateProfilePictureSchema } from '../schemas/updateProfilePicture.schema';
import { UpdateProfilePictureService } from '../services/updateProfilePicture.service';

@Controller('users')
@UseGuards(JwtAuthGuard, OwnershipGuard)
export class UpdateProfilePictureController {
  constructor(private readonly updateProfilePictureService: UpdateProfilePictureService) {}

  @Patch(':userId/profile-picture')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateProfilePictureSchema))
  execute(@Param('userId', ParseUUIDPipe) userId: string, @Body() data: UpdateProfilePictureDTO) {
    return this.updateProfilePictureService.execute(userId, data);
  }
}
