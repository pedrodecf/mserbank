import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from '@prisma/client';
import { RedisService } from '../../../infrastructure/cache/redis.service';
import { FindOneUserRepository } from '../repositories/findOneUser.repository';
import { UpdateProfilePictureRepository } from '../repositories/updateProfilePicture.repository';
import { UpdateProfilePictureService } from './updateProfilePicture.service';

describe('UpdateProfilePictureService', () => {
  let service: UpdateProfilePictureService;
  let mockFindOneUserRepository: { execute: jest.Mock };
  let mockUpdateProfilePictureRepository: { execute: jest.Mock };
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
    profilePicture: 'https://example.com/profile.jpg',
  };

  const mockUpdateProfilePictureDTO = {
    profilePicture: 'https://example.com/profile.jpg',
  };

  beforeEach(async () => {
    mockFindOneUserRepository = {
      execute: jest.fn(),
    };

    mockUpdateProfilePictureRepository = {
      execute: jest.fn(),
    };

    mockRedisService = {
      del: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateProfilePictureService,
        {
          provide: FindOneUserRepository,
          useValue: mockFindOneUserRepository,
        },
        {
          provide: UpdateProfilePictureRepository,
          useValue: mockUpdateProfilePictureRepository,
        },
        {
          provide: RedisService,
          useValue: mockRedisService,
        },
      ],
    }).compile();

    service = module.get<UpdateProfilePictureService>(UpdateProfilePictureService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should update profile picture successfully', async () => {
    mockFindOneUserRepository.execute.mockResolvedValue(mockUser);
    mockUpdateProfilePictureRepository.execute.mockResolvedValue(mockUpdatedUser);
    mockRedisService.del.mockResolvedValue(undefined);

    const result = await service.execute('user-123', mockUpdateProfilePictureDTO);

    expect(result).toEqual(mockUpdatedUser);
    expect(mockFindOneUserRepository.execute).toHaveBeenCalledWith('user-123');
    expect(mockUpdateProfilePictureRepository.execute).toHaveBeenCalledWith(
      'user-123',
      mockUpdateProfilePictureDTO.profilePicture,
    );
    expect(mockRedisService.del).toHaveBeenCalledWith('user:user-123');
  });

  it('should throw NotFoundException when user does not exist', async () => {
    mockFindOneUserRepository.execute.mockResolvedValue(null);

    await expect(service.execute('user-123', mockUpdateProfilePictureDTO)).rejects.toThrow(
      NotFoundException,
    );
    expect(mockFindOneUserRepository.execute).toHaveBeenCalledWith('user-123');
    expect(mockUpdateProfilePictureRepository.execute).not.toHaveBeenCalled();
    expect(mockRedisService.del).not.toHaveBeenCalled();
  });
});
