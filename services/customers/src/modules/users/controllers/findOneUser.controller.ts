import { Controller, Get, Param } from '@nestjs/common';
import { FindOneUserService } from '../services/findOneUser.service';

@Controller('users')
export class FindOneUserController {
  constructor(private readonly findOneUserService: FindOneUserService) {}

  @Get(':userId')
  execute(@Param('userId') userId: string) {
    return this.findOneUserService.execute(userId);
  }
}
