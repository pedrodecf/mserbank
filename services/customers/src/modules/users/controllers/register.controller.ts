import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { RegisterDTO } from '../dto/register.dto';
import { registerSchema } from '../schemas/register.schema';
import { RegisterService } from '../services/register.service';

@Controller('users')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(registerSchema))
  execute(@Body() data: RegisterDTO) {
    return this.registerService.execute(data);
  }
}
