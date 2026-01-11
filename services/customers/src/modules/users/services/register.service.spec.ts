import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { RegisterDTO } from '../dto/register.dto';
import { CreatePasswordRepository } from '../repositories/createPassword.repository';
import { CreateUserRepository } from '../repositories/createUser.repository';
import { FindUserByEmailRepository } from '../repositories/findUserByEmail.repository';
import { RegisterService } from './register.service';

describe('RegisterService', () => {
  let service: RegisterService;
  let mockCreateUserRepository: { execute: jest.Mock };
  let mockCreatePasswordRepository: { execute: jest.Mock };
  let mockFindUserByEmailRepository: { execute: jest.Mock };

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

  const mockRegisterDTO: RegisterDTO = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  };

  beforeEach(async () => {
    mockCreateUserRepository = {
      execute: jest.fn(),
    };

    mockCreatePasswordRepository = {
      execute: jest.fn(),
    };

    mockFindUserByEmailRepository = {
      execute: jest.fn(),
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RegisterService,
        {
          provide: CreateUserRepository,
          useValue: mockCreateUserRepository,
        },
        {
          provide: CreatePasswordRepository,
          useValue: mockCreatePasswordRepository,
        },
        {
          provide: FindUserByEmailRepository,
          useValue: mockFindUserByEmailRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<RegisterService>(RegisterService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a new user successfully', async () => {
    mockFindUserByEmailRepository.execute.mockResolvedValue(null);
    mockCreateUserRepository.execute.mockResolvedValue(mockUser);
    mockCreatePasswordRepository.execute.mockResolvedValue({
      id: 'user-123',
      hash: 'hashedPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await service.execute(mockRegisterDTO);

    expect(result).toEqual({ message: 'User created successfully' });
    expect(mockFindUserByEmailRepository.execute).toHaveBeenCalledWith(mockRegisterDTO.email);
    expect(mockCreateUserRepository.execute).toHaveBeenCalledWith(
      mockRegisterDTO.name,
      mockRegisterDTO.email,
    );
    expect(mockCreatePasswordRepository.execute).toHaveBeenCalled();
  });

  it('should throw BadRequestException when email already exists', async () => {
    mockFindUserByEmailRepository.execute.mockResolvedValue(mockUser);

    await expect(service.execute(mockRegisterDTO)).rejects.toThrow(BadRequestException);
    expect(mockFindUserByEmailRepository.execute).toHaveBeenCalledWith(mockRegisterDTO.email);
    expect(mockCreateUserRepository.execute).not.toHaveBeenCalled();
    expect(mockCreatePasswordRepository.execute).not.toHaveBeenCalled();
  });
});
