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
import { FindTransactionsByUserService } from '../services/findTransactionsByUser.service';

@Controller('transactions')
@UseGuards(JwtAuthGuard)
export class FindTransactionsByUserController {
  constructor(private readonly findTransactionsByUserService: FindTransactionsByUserService) {}

  @Get('user/:userId')
  @HttpCode(HttpStatus.OK)
  execute(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.findTransactionsByUserService.execute(userId);
  }
}
