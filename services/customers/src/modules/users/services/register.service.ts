import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDTO } from '../dto/register.dto';
import { CreatePasswordRepository } from '../repositories/createPassword.repository';
import { CreateUserRepository } from '../repositories/createUser.repository';
import { FindUserByEmailRepository } from '../repositories/findUserByEmail.repository';

@Injectable()
export class RegisterService {
  constructor(
    private readonly createUserRepository: CreateUserRepository,
    private readonly createPasswordRepository: CreatePasswordRepository,
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(data: RegisterDTO) {
    const userAlreadyExists = await this.findUserByEmailRepository.execute(data.email);

    if (userAlreadyExists) {
      throw new BadRequestException('Email already in use');
    }

    const user = await this.createUserRepository.execute(data.name, data.email);

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await this.createPasswordRepository.execute(user.id, hashedPassword);

    return {
      message: 'User created successfully',
    };
  }
}
