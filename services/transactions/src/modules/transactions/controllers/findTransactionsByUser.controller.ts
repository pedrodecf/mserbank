import { Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe } from '@nestjs/common';
import { FindTransactionsByUserService } from '../services/findTransactionsByUser.service';

@Controller('transactions')
export class FindTransactionsByUserController {
  constructor(private readonly findTransactionsByUserService: FindTransactionsByUserService) {}

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  execute(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.findTransactionsByUserService.execute(userId);
  }
}
