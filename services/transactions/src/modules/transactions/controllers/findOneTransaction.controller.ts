import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../infrastructure/auth/jwt-auth.guard';
import { FindOneTransactionService } from '../services/findOneTransaction.service';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class FindOneTransactionController {
  constructor(private readonly findOneTransactionService: FindOneTransactionService) {}

  @Get(':transactionId')
  @HttpCode(HttpStatus.OK)
  execute(@Param('transactionId', ParseUUIDPipe) transactionId: string) {
    return this.findOneTransactionService.execute(transactionId);
  }
}
