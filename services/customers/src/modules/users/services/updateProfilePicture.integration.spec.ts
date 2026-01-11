import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { CACHE_PREFIXES } from '../../../common/constants/cache.constants';
import { RedisService } from '../../../infrastructure/cache/redis.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CreateUserRepository } from '../repositories/createUser.repository';
import { UpdateProfilePictureService } from './updateProfilePicture.service';

describe('UpdateProfilePictureService Integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redisService: RedisService;
  let updateProfilePictureService: UpdateProfilePictureService;
  let createUserRepository: CreateUserRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    redisService = moduleFixture.get<RedisService>(RedisService);
    updateProfilePictureService = moduleFixture.get<UpdateProfilePictureService>(
      UpdateProfilePictureService,
    );
    createUserRepository = moduleFixture.get<CreateUserRepository>(CreateUserRepository);
  });

  afterAll(async () => {
    if (prisma) {
      await prisma.$disconnect();
    }
    if (app) {
      await app.close();
    }
  });

  beforeEach(async () => {
    await prisma.usersPassword.deleteMany({});
    await prisma.bankingDetails.deleteMany({});
    await prisma.user.deleteMany({});
    await redisService.delByPattern('user:*');
  });

  it('should update profile picture in the database', async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    const user = await createUserRepository.execute('Test User', uniqueEmail);

    const updatedUser = await updateProfilePictureService.execute(user.id, {
      profilePicture: 'https://example.com/profile.jpg',
    });

    expect(updatedUser).toBeDefined();
    expect(updatedUser.profilePicture).toBe('https://example.com/profile.jpg');
  });

  it('should invalidate cache after updating profile picture', async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    const user = await createUserRepository.execute('Test User', uniqueEmail);

    // Popular cache
    await redisService.set(`${CACHE_PREFIXES.USER}:${user.id}`, user);

    // Verificar que está no cache
    let cachedUser = await redisService.get(`${CACHE_PREFIXES.USER}:${user.id}`);
    expect(cachedUser).toBeDefined();

    // Atualizar foto de perfil
    await updateProfilePictureService.execute(user.id, {
      profilePicture: 'https://example.com/new-profile.jpg',
    });

    // Verificar que cache foi invalidado
    cachedUser = await redisService.get(`${CACHE_PREFIXES.USER}:${user.id}`);
    expect(cachedUser).toBeNull();
  });
});
