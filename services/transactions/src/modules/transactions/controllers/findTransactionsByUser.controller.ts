import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../infrastructure/auth/guards/jwt-auth.guard';
import { OwnershipGuard } from '../../../infrastructure/auth/guards/ownership.guard';
import { TransactionResponseDTO } from '../dto/swagger/transactionResponse.dto';
import { FindTransactionsByUserService } from '../services/findTransactionsByUser.service';

@ApiTags('transactions')
@ApiBearerAuth('access-token')
@Controller('transactions')
@UseGuards(JwtAuthGuard, OwnershipGuard)
export class FindTransactionsByUserController {
  constructor(private readonly findTransactionsByUserService: FindTransactionsByUserService) {}

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get transactions by user',
    description:
      'Returns all transactions (sent and received) of a specific user. Requires authentication and the user must be the account owner.',
  })
  @ApiParam({
    name: 'userId',
    description: 'Unique user ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'List of user transactions',
    type: [TransactionResponseDTO],
  })
  execute(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.findTransactionsByUserService.execute(userId);
  }
}
