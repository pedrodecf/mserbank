import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from 'nestjs-zod';
import { LoginDTO } from '../../users/dto/login.dto';
import { loginSchema } from '../../users/schemas/login.schema';
import { LoginService } from '../services/login.service';

@Controller('users')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(loginSchema))
  execute(@Body() data: LoginDTO) {
    return this.loginService.execute(data);
  }
}
