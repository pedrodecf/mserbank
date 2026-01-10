import { Controller, Get, Param, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { transactionIdSchema } from '../schemas/transactionId.schema';
import { FindOneTransactionService } from '../services/findOneTransaction.service';

@Controller('transactions')
export class FindOneTransactionController {
  constructor(private readonly findOneTransactionService: FindOneTransactionService) {}

  @Get(':transactionId')
  @UsePipes(new ZodValidationPipe(transactionIdSchema))
  execute(@Param('transactionId') transactionId: string) {
    return this.findOneTransactionService.execute(transactionId);
  }
}
