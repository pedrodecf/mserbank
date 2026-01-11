import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
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
import { UpdateUserDTO } from '../dto/updateUser.dto';
import { updateUserSchema } from '../schemas/updateUser.schema';
import { UpdateUserService } from '../services/updateUser.service';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard, OwnershipGuard)
export class UpdateUserController {
  constructor(private readonly updateUserService: UpdateUserService) {}

  @Patch(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Update user data',
    description:
      'Updates user data. All fields are optional, but at least one must be provided. Requires authentication and the user must be the account owner.',
  })
  @ApiParam({
    name: 'userId',
    description: 'Unique user ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'User updated successfully',
    type: UserResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  execute(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body(new ZodValidationPipe(updateUserSchema)) data: UpdateUserDTO,
  ) {
    return this.updateUserService.execute(userId, data);
  }
}
