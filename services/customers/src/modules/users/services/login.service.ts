import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from '../../../infrastructure/auth/jwt.strategy';
import { LoginDTO } from '../../users/dto/login.dto';
import { FindPasswordByUserIdRepository } from '../repositories/findPasswordByUserId.repository';
import { FindUserByEmailRepository } from '../repositories/findUserByEmail.repository';

@Injectable()
export class LoginService {
  private readonly logger = new Logger(LoginService.name);

  constructor(
    private readonly findUserByEmailRepository: FindUserByEmailRepository,
    private readonly findPasswordByUserIdRepository: FindPasswordByUserIdRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(data: LoginDTO) {
    this.logger.debug({ email: data.email }, 'Attempting login');

    const user = await this.findUserByEmailRepository.execute(data.email);

    if (!user) {
      this.logger.warn({ email: data.email }, 'Login failed: user not found');
      throw new UnauthorizedException('Invalid email or password');
    }

    const userPassword = await this.findPasswordByUserIdRepository.execute(user.id);

    if (!userPassword) {
      this.logger.warn({ userId: user.id, email: data.email }, 'Login failed: password not found');
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, userPassword.hash);

    if (!isPasswordValid) {
      this.logger.warn({ userId: user.id, email: data.email }, 'Login failed: invalid password');
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = this.jwtService.sign(payload);

    this.logger.log({ userId: user.id, email: user.email }, 'Login successful');

    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
}
