import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/infrastructure/auth/guards/jwt-auth.guard';
import { OwnershipGuard } from 'src/infrastructure/auth/guards/ownership.guard';
import { GetUserBalanceService } from '../services/getUserBalance.service';

@ApiTags('users')
@ApiBearerAuth('access-token')
@Controller('users')
@UseGuards(JwtAuthGuard, OwnershipGuard)
export class GetUserBalanceController {
  constructor(private readonly getUserBalanceService: GetUserBalanceService) {}

  @Get(':userId/balance')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get user balance',
    description: 'Get the balance of a specific user.',
  })
  @ApiParam({
    name: 'userId',
    description: 'Unique user ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  execute(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.getUserBalanceService.execute(userId);
  }
}
