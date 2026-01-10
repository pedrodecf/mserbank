import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
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
import { JwtAuthGuard } from '../../../infrastructure/auth/guards/jwt-auth.guard';
import { OwnershipGuard } from '../../../infrastructure/auth/guards/ownership.guard';
import { UserResponseDTO } from '../dto/swagger/userResponse.dto';
import { FindOneUserService } from '../services/findOneUser.service';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard, OwnershipGuard)
export class FindOneUserController {
  constructor(private readonly findOneUserService: FindOneUserService) {}

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user by ID',
    description:
      'Returns complete data of a specific user. Requires authentication and the user must be the account owner.',
  })
  @ApiParam({
    name: 'userId',
    description: 'Unique user ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'User found successfully',
    type: UserResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'User not found',
  })
  execute(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.findOneUserService.execute(userId);
  }
}
