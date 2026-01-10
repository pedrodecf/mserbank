import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UsePipes } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import {
  CurrentUser,
  type CurrentUserPayload,
} from '../../../infrastructure/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../infrastructure/auth/guards/jwt-auth.guard';
import { CreateTransactionDTO } from '../dto/createTransaction.dto';
import { TransactionResponseDTO } from '../dto/swagger/transactionResponse.dto';
import { createTransactionSchema } from '../schemas/createTransaction.schema';
import { CreateTransactionService } from '../services/createTransaction.service';

@ApiTags('transactions')
@ApiBearerAuth('access-token')
@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class CreateTransactionController {
  constructor(private readonly createTransactionService: CreateTransactionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(createTransactionSchema))
  @ApiOperation({
    summary: 'Create new transaction',
    description:
      'Creates a new transaction between two users. The authenticated user must be the sender. The amount must be provided in cents (e.g., $10.50 = 1050).',
  })
  @ApiCreatedResponse({
    description: 'Transaction created successfully',
    type: TransactionResponseDTO,
  })
  @ApiForbiddenResponse({
    description: 'You can only create transactions as yourself',
  })
  execute(@Body() data: CreateTransactionDTO, @CurrentUser() currentUser: CurrentUserPayload) {
    return this.createTransactionService.execute(data, currentUser.userId);
  }
}
