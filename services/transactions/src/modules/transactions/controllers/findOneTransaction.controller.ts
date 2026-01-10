import { Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe } from '@nestjs/common';
import { FindOneTransactionService } from '../services/findOneTransaction.service';

@Controller('transactions')
export class FindOneTransactionController {
  constructor(private readonly findOneTransactionService: FindOneTransactionService) {}

  @Get(':transactionId')
  @HttpCode(HttpStatus.OK)
  execute(@Param('transactionId', ParseUUIDPipe) transactionId: string) {
    return this.findOneTransactionService.execute(transactionId);
  }
}
