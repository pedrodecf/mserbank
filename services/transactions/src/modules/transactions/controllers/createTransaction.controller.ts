import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { CreateTransactionDTO } from '../dto/createTransaction.dto';
import { createTransactionSchema } from '../schemas/createTransaction.schema';
import { CreateTransactionService } from '../services/createTransaction.service';

@Controller('transactions')
export class CreateTransactionController {
  constructor(private readonly createTransactionService: CreateTransactionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createTransactionSchema))
  execute(@Body() data: CreateTransactionDTO) {
    return this.createTransactionService.execute(data);
  }
}
