import { Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe } from '@nestjs/common';
import { FindOneUserService } from '../services/findOneUser.service';

@Controller('users')
export class FindOneUserController {
  constructor(private readonly findOneUserService: FindOneUserService) {}

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  execute(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.findOneUserService.execute(userId);
  }
}
