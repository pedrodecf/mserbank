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
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../../../infrastructure/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../infrastructure/auth/guards/jwt-auth.guard';
import { TransactionResponseDTO } from '../dto/swagger/transactionResponse.dto';
import { FindOneTransactionService } from '../services/findOneTransaction.service';

@ApiTags('transactions')
@ApiBearerAuth('access-token')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class FindOneTransactionController {
  constructor(private readonly findOneTransactionService: FindOneTransactionService) {}

  @Get(':transactionId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Get transaction by ID',
    description:
      'Returns complete data of a specific transaction. Only the sender or receiver can view the transaction.',
  })
  @ApiParam({
    name: 'transactionId',
    description: 'Unique transaction ID (UUID)',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiOkResponse({
    description: 'Transaction found successfully',
    type: TransactionResponseDTO,
  })
  @ApiNotFoundResponse({
    description: 'Transaction not found',
  })
  execute(
    @Param('transactionId', ParseUUIDPipe) transactionId: string,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.findOneTransactionService.execute(transactionId, currentUser.userId);
  }
}
