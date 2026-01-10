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
import { FindOneUserService } from '../services/findOneUser.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class FindOneUserController {
  constructor(private readonly findOneUserService: FindOneUserService) {}

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  execute(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.findOneUserService.execute(userId);
  }
}
