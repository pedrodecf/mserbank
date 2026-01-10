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
import { FindOneUserService } from '../services/findOneUser.service';

@Controller('users')
@UseGuards(JwtAuthGuard, OwnershipGuard)
export class FindOneUserController {
  constructor(private readonly findOneUserService: FindOneUserService) {}

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  execute(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.findOneUserService.execute(userId);
  }
}
