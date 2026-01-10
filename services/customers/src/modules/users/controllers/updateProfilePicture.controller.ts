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
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { JwtAuthGuard } from '../../../infrastructure/auth/guards/jwt-auth.guard';
import { OwnershipGuard } from '../../../infrastructure/auth/guards/ownership.guard';
import { UserResponseDTO } from '../dto/swagger/userResponse.dto';
import { UpdateProfilePictureDTO } from '../dto/updateProfilePicture.dto';
import { updateProfilePictureSchema } from '../schemas/updateProfilePicture.schema';
import { UpdateProfilePictureService } from '../services/updateProfilePicture.service';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard, OwnershipGuard)
export class UpdateProfilePictureController {
  constructor(private readonly updateProfilePictureService: UpdateProfilePictureService) {}

  @Patch(':userId/profile-picture')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateProfilePictureSchema))
  @ApiOperation({
    summary: 'Update profile picture',
    description:
      'Updates the user profile picture URL. Requires authentication and the user must be the account owner.',
  })
  @ApiParam({
    name: 'userId',
    description: 'Unique user ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Profile picture updated successfully',
    type: UserResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  execute(@Param('userId', ParseUUIDPipe) userId: string, @Body() data: UpdateProfilePictureDTO) {
    return this.updateProfilePictureService.execute(userId, data);
  }
}
