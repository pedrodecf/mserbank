import { Controller, Get, Param, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { userIdSchema } from '../schemas/userId.schema';
import { FindTransactionsByUserService } from '../services/findTransactionsByUser.service';

@Controller('transactions')
export class FindTransactionsByUserController {
  constructor(private readonly findTransactionsByUserService: FindTransactionsByUserService) {}

  @Get('user/:userId')
  @UsePipes(new ZodValidationPipe(userIdSchema))
  execute(@Param('userId') userId: string) {
    return this.findTransactionsByUserService.execute(userId);
  }
}
