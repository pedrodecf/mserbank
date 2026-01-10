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
  CurrentUser,
  type CurrentUserPayload,
} from '../../../infrastructure/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../infrastructure/auth/guards/jwt-auth.guard';
import { FindOneTransactionService } from '../services/findOneTransaction.service';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class FindOneTransactionController {
  constructor(private readonly findOneTransactionService: FindOneTransactionService) {}

  @Get(':transactionId')
  @HttpCode(HttpStatus.OK)
  execute(
    @Param('transactionId', ParseUUIDPipe) transactionId: string,
    @CurrentUser() currentUser: CurrentUserPayload,
  ) {
    return this.findOneTransactionService.execute(transactionId, currentUser.userId);
  }
}
