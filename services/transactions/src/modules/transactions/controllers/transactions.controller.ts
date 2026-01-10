import { Controller, Get, Post, Param } from '@nestjs/common';
import { TransactionsService } from '../services/transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post()
  create() {
    return this.transactionsService.create();
  }

  @Get(':transactionId')
  findOne(@Param('transactionId') transactionId: string) {
    return this.transactionsService.findOne(transactionId);
  }

  @Get('user/:userId')
  findByUser(@Param('userId') userId: string) {
    return this.transactionsService.findByUser(userId);
  }
}
