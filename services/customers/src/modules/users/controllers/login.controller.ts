import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { LoginDTO } from '../../users/dto/login.dto';
import { loginSchema } from '../../users/schemas/login.schema';
import { LoginService } from '../services/login.service';
import { LoginResponseDTO } from '../dto/swagger/loginResponse.dto';

@ApiTags('users')
@Controller('users')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ZodValidationPipe(loginSchema))
  @ApiOperation({
    summary: 'Authenticate user',
    description: 'Performs user login and returns a JWT access token along with user data.',
  })
  @ApiOkResponse({
    description: 'Login successful',
    type: LoginResponseDTO,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password',
  })
  execute(@Body() data: LoginDTO) {
    return this.loginService.execute(data);
  }
}
