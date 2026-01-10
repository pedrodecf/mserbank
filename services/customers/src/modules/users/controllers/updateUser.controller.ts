import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { JwtAuthGuard } from '../../../infrastructure/auth/guards/jwt-auth.guard';
import { OwnershipGuard } from '../../../infrastructure/auth/guards/ownership.guard';
import { UpdateUserDTO } from '../dto/updateUser.dto';
import { updateUserSchema } from '../schemas/updateUser.schema';
import { UpdateUserService } from '../services/updateUser.service';

@Controller('users')
@UseGuards(JwtAuthGuard, OwnershipGuard)
export class UpdateUserController {
  constructor(private readonly updateUserService: UpdateUserService) {}

  @Patch(':userId')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(updateUserSchema))
  execute(@Param('userId', ParseUUIDPipe) userId: string, @Body() data: UpdateUserDTO) {
    return this.updateUserService.execute(userId, data);
  }
}
