import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { RedisService } from '../../../infrastructure/cache/redis.service';
import { FindOneUserRepository } from '../repositories/findOneUser.repository';
import { FindOneUserService } from './findOneUser.service';

describe('FindOneUserService', () => {
  let service: FindOneUserService;
  let mockFindOneUserRepository: { execute: jest.Mock };
  let mockRedisService: { get: jest.Mock; set: jest.Mock };

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

  beforeEach(async () => {
    mockFindOneUserRepository = {
      execute: jest.fn(),
    };

    mockRedisService = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOneUserService,
        {
          provide: FindOneUserRepository,
          useValue: mockFindOneUserRepository,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<FindOneUserService>(FindOneUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user from cache when available', async () => {
    mockRedisService.get.mockResolvedValue(mockUser);

    const result = await service.execute('user-123');

    expect(result).toEqual(mockUser);
    expect(mockRedisService.get).toHaveBeenCalledWith('user:user-123');
    expect(mockFindOneUserRepository.execute).not.toHaveBeenCalled();
  });

  it('should return user from database when not in cache', async () => {
    mockRedisService.get.mockResolvedValue(null);
    mockFindOneUserRepository.execute.mockResolvedValue(mockUser);

    const result = await service.execute('user-123');

    expect(result).toEqual(mockUser);
    expect(mockRedisService.get).toHaveBeenCalledWith('user:user-123');
    expect(mockFindOneUserRepository.execute).toHaveBeenCalledWith('user-123');
    expect(mockRedisService.set).toHaveBeenCalledWith('user:user-123', mockUser);
  });

  it('should throw NotFoundException when user does not exist', async () => {
    mockRedisService.get.mockResolvedValue(null);
    mockFindOneUserRepository.execute.mockResolvedValue(null);

    await expect(service.execute('user-123')).rejects.toThrow(NotFoundException);
    expect(mockRedisService.get).toHaveBeenCalledWith('user:user-123');
    expect(mockFindOneUserRepository.execute).toHaveBeenCalledWith('user-123');
    expect(mockRedisService.set).not.toHaveBeenCalled();
  });
});
