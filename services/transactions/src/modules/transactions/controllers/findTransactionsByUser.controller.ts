import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../infrastructure/auth/guards/jwt-auth.guard';
import { OwnershipGuard } from '../../../infrastructure/auth/guards/ownership.guard';
import { FindTransactionsByUserService } from '../services/findTransactionsByUser.service';

@Controller('transactions')
@UseGuards(JwtAuthGuard, OwnershipGuard)
export class FindTransactionsByUserController {
  constructor(private readonly findTransactionsByUserService: FindTransactionsByUserService) {}

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  execute(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.findTransactionsByUserService.execute(userId);
  }
}
