import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { CACHE_PREFIXES } from '../../../common/constants/cache.constants';
import { RedisService } from '../../../infrastructure/cache/redis.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CreateUserRepository } from '../repositories/createUser.repository';
import { FindOneUserService } from './findOneUser.service';

describe('FindOneUserService Integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redisService: RedisService;
  let findOneUserService: FindOneUserService;
  let createUserRepository: CreateUserRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    redisService = moduleFixture.get<RedisService>(RedisService);
    findOneUserService = moduleFixture.get<FindOneUserService>(FindOneUserService);
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

  it('should find user from database when not in cache', async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    const user = await createUserRepository.execute('Test User', uniqueEmail);

    const foundUser = await findOneUserService.execute(user.id);

    expect(foundUser).toBeDefined();
    expect(foundUser.id).toBe(user.id);
    expect(foundUser.name).toBe('Test User');
    expect(foundUser.email).toBe(uniqueEmail);
  });

  it('should return user from cache when available', async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    const user = await createUserRepository.execute('Test User', uniqueEmail);

    // Primeira chamada - popula cache
    await findOneUserService.execute(user.id);

    // Verificar se está no cache
    const cachedUser = await redisService.get<{ id: string; name: string; email: string }>(
      `${CACHE_PREFIXES.USER}:${user.id}`,
    );
    expect(cachedUser).toBeDefined();
    expect(cachedUser?.id).toBe(user.id);

    // Segunda chamada - deve vir do cache
    const foundUser = await findOneUserService.execute(user.id);
    expect(foundUser).toBeDefined();
    expect(foundUser.id).toBe(user.id);
  });

  it('should not find soft-deleted users', async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    const user = await createUserRepository.execute('Test User', uniqueEmail);

    // Soft delete
    await prisma.user.update({
      where: { id: user.id },
      data: { deletedAt: new Date() },
    });

    await expect(findOneUserService.execute(user.id)).rejects.toThrow();
  });
});
