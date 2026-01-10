import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from '../dto/register.dto';
import { CreatePasswordRepository } from '../repositories/createPassword.repository';
import { CreateUserRepository } from '../repositories/createUser.repository';
import { FindUserByEmailRepository } from '../repositories/findUserByEmail.repository';

@Injectable()
export class RegisterService {
  private readonly logger = new Logger(RegisterService.name);

  constructor(
    private readonly createUserRepository: CreateUserRepository,
    private readonly createPasswordRepository: CreatePasswordRepository,
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(data: RegisterDTO) {
    this.logger.debug({ email: data.email }, 'Attempting user registration');

    const userAlreadyExists = await this.findUserByEmailRepository.execute(data.email);

    if (userAlreadyExists) {
      this.logger.warn({ email: data.email }, 'Registration failed: email already in use');
      throw new BadRequestException('Email already in use');
    }

    const user = await this.createUserRepository.execute(data.name, data.email);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await this.createPasswordRepository.execute(user.id, hashedPassword);

    this.logger.log({ userId: user.id, email: user.email }, 'User registered successfully');

    return {
      message: 'User created successfully',
    };
  }
}
