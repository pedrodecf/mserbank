import { Body, Controller, HttpCode, HttpStatus, Post, UsePipes } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { RegisterDTO } from '../dto/register.dto';
import { RegisterResponseDTO } from '../dto/swagger/registerResponse.dto';
import { registerSchema } from '../schemas/register.schema';
import { RegisterService } from '../services/register.service';

@ApiTags('users')
@Controller('users')
export class RegisterController {
  constructor(private readonly registerService: RegisterService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ZodValidationPipe(registerSchema))
  @ApiOperation({
    summary: 'Register new user',
    description: 'Creates a new user account in the system. Returns a success message.',
  })
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: RegisterResponseDTO,
  })
  execute(@Body() data: RegisterDTO) {
    return this.registerService.execute(data);
  }
}
