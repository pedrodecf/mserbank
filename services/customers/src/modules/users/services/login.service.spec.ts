import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { FindPasswordByUserIdRepository } from '../repositories/findPasswordByUserId.repository';
import { FindUserByEmailRepository } from '../repositories/findUserByEmail.repository';
import { LoginService } from './login.service';

jest.mock('bcrypt');

describe('LoginService', () => {
  let service: LoginService;
  let mockFindUserByEmailRepository: { execute: jest.Mock };
  let mockFindPasswordByUserIdRepository: { execute: jest.Mock };
  let mockJwtService: { sign: jest.Mock };

  const mockUser: User = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    address: null,
    profilePicture: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };

  const mockLoginDTO = {
    email: 'john@example.com',
    password: 'password123',
  };

  const mockPassword = {
    hash: 'hashedPassword123',
  };

  beforeEach(async () => {
    mockFindUserByEmailRepository = {
      execute: jest.fn(),
    };

    mockFindPasswordByUserIdRepository = {
      execute: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginService,
        {
          provide: FindUserByEmailRepository,
          useValue: mockFindUserByEmailRepository,
        },
        {
          provide: FindPasswordByUserIdRepository,
          useValue: mockFindPasswordByUserIdRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<LoginService>(LoginService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should login successfully with valid credentials', async () => {
    mockFindUserByEmailRepository.execute.mockResolvedValue(mockUser);
    mockFindPasswordByUserIdRepository.execute.mockResolvedValue(mockPassword);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockJwtService.sign.mockReturnValue('access-token-123');

    const result = await service.execute(mockLoginDTO);

    expect(result).toEqual({
      accessToken: 'access-token-123',
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      },
    });
    expect(mockFindUserByEmailRepository.execute).toHaveBeenCalledWith(mockLoginDTO.email);
    expect(mockFindPasswordByUserIdRepository.execute).toHaveBeenCalledWith(mockUser.id);
    expect(bcrypt.compare).toHaveBeenCalledWith(mockLoginDTO.password, mockPassword.hash);
    expect(mockJwtService.sign).toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when user does not exist', async () => {
    mockFindUserByEmailRepository.execute.mockResolvedValue(null);

    await expect(service.execute(mockLoginDTO)).rejects.toThrow(UnauthorizedException);
    expect(mockFindUserByEmailRepository.execute).toHaveBeenCalledWith(mockLoginDTO.email);
    expect(mockFindPasswordByUserIdRepository.execute).not.toHaveBeenCalled();
  });

  it('should throw UnauthorizedException when password does not exist', async () => {
    mockFindUserByEmailRepository.execute.mockResolvedValue(mockUser);
    mockFindPasswordByUserIdRepository.execute.mockResolvedValue(null);

    await expect(service.execute(mockLoginDTO)).rejects.toThrow(UnauthorizedException);
    expect(mockFindUserByEmailRepository.execute).toHaveBeenCalledWith(mockLoginDTO.email);
    expect(mockFindPasswordByUserIdRepository.execute).toHaveBeenCalledWith(mockUser.id);
  });

  it('should throw UnauthorizedException when password is invalid', async () => {
    mockFindUserByEmailRepository.execute.mockResolvedValue(mockUser);
    mockFindPasswordByUserIdRepository.execute.mockResolvedValue(mockPassword);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(service.execute(mockLoginDTO)).rejects.toThrow(UnauthorizedException);
    expect(mockFindUserByEmailRepository.execute).toHaveBeenCalledWith(mockLoginDTO.email);
    expect(mockFindPasswordByUserIdRepository.execute).toHaveBeenCalledWith(mockUser.id);
    expect(bcrypt.compare).toHaveBeenCalledWith(mockLoginDTO.password, mockPassword.hash);
    expect(mockJwtService.sign).not.toHaveBeenCalled();
  });
});
