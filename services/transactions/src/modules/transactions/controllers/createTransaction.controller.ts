import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../../../infrastructure/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../infrastructure/auth/guards/jwt-auth.guard';
import { CreateTransactionDTO } from '../dto/createTransaction.dto';
import { createTransactionSchema } from '../schemas/createTransaction.schema';
import { CreateTransactionService } from '../services/createTransaction.service';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class CreateTransactionController {
  constructor(private readonly createTransactionService: CreateTransactionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createTransactionSchema))
  execute(@Body() data: CreateTransactionDTO, @CurrentUser() currentUser: CurrentUserPayload) {
    return this.createTransactionService.execute(data, currentUser.userId);
  }
}
