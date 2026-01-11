import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { RedisService } from '../../../infrastructure/cache/redis.service';
import { UpdateUserDTO } from '../dto/updateUser.dto';
import { FindOneUserRepository } from '../repositories/findOneUser.repository';
import { UpdateUserRepository } from '../repositories/updateUser.repository';
import { UpdateUserService } from './updateUser.service';

describe('UpdateUserService', () => {
  let service: UpdateUserService;
  let mockFindOneUserRepository: { execute: jest.Mock };
  let mockUpdateUserRepository: { execute: jest.Mock };
  let mockRedisService: { del: jest.Mock };

  const mockUser: User & { bankingDetails: null } = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    address: null,
    profilePicture: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
    bankingDetails: null,
  };

  const mockUpdatedUser: User & { bankingDetails: null } = {
    ...mockUser,
    name: 'Jane Doe',
    address: '123 Main St',
  };

  const mockUpdateUserDTO: UpdateUserDTO = {
    name: 'Jane Doe',
    address: '123 Main St',
  };

  beforeEach(async () => {
    mockFindOneUserRepository = {
      execute: jest.fn(),
    };

    mockUpdateUserRepository = {
      execute: jest.fn(),
    };

    mockRedisService = {
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserService,
        {
          provide: FindOneUserRepository,
          useValue: mockFindOneUserRepository,
        },
        {
          provide: UpdateUserRepository,
          useValue: mockUpdateUserRepository,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<UpdateUserService>(UpdateUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update user successfully', async () => {
    mockFindOneUserRepository.execute.mockResolvedValue(mockUser);
    mockUpdateUserRepository.execute.mockResolvedValue(mockUpdatedUser);
    mockRedisService.del.mockResolvedValue(undefined);

    const result = await service.execute('user-123', mockUpdateUserDTO);

    expect(result).toEqual(mockUpdatedUser);
    expect(mockFindOneUserRepository.execute).toHaveBeenCalledWith('user-123');
    expect(mockUpdateUserRepository.execute).toHaveBeenCalledWith('user-123', mockUpdateUserDTO);
    expect(mockRedisService.del).toHaveBeenCalledWith('user:user-123');
  });

  it('should throw NotFoundException when user does not exist', async () => {
    mockFindOneUserRepository.execute.mockResolvedValue(null);

    await expect(service.execute('user-123', mockUpdateUserDTO)).rejects.toThrow(NotFoundException);
    expect(mockFindOneUserRepository.execute).toHaveBeenCalledWith('user-123');
    expect(mockUpdateUserRepository.execute).not.toHaveBeenCalled();
    expect(mockRedisService.del).not.toHaveBeenCalled();
  });
});
