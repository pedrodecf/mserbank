import { Body, Controller, HttpCode, HttpStatus, Param, Patch, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { UpdateUserDTO } from '../dto/updateUser.dto';
import { updateUserSchema } from '../schemas/updateUser.schema';
import { UpdateUserService } from '../services/updateUser.service';

@Controller('users')
export class UpdateUserController {
  constructor(private readonly updateUserService: UpdateUserService) {}

  @Patch(':userId')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateUserSchema))
  execute(@Param('userId') userId: string, @Body() data: UpdateUserDTO) {
    return this.updateUserService.execute(userId, data);
  }
}
