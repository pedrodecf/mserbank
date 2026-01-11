import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { RedisService } from '../../../infrastructure/cache/redis.service';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CreateUserRepository } from '../repositories/createUser.repository';
import { FindOneUserRepository } from '../repositories/findOneUser.repository';
import { UpdateUserRepository } from '../repositories/updateUser.repository';

describe('UpdateUserRepository Integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let redisService: RedisService;
  let createUserRepository: CreateUserRepository;
  let updateUserRepository: UpdateUserRepository;
  let findOneUserRepository: FindOneUserRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    redisService = moduleFixture.get<RedisService>(RedisService);
    createUserRepository = moduleFixture.get<CreateUserRepository>(CreateUserRepository);
    updateUserRepository = moduleFixture.get<UpdateUserRepository>(UpdateUserRepository);
    findOneUserRepository = moduleFixture.get<FindOneUserRepository>(FindOneUserRepository);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.usersPassword.deleteMany({});
    await prisma.bankingDetails.deleteMany({});
    await prisma.user.deleteMany({});
    await redisService.delByPattern('user:*');
  });

  it('should update user data in the database', async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    const user = await createUserRepository.execute('Test User', uniqueEmail);

    const updatedUser = await updateUserRepository.execute(user.id, {
      name: 'Updated User',
      address: '123 Test St',
    });

    expect(updatedUser).toBeDefined();
    expect(updatedUser.name).toBe('Updated User');
    expect(updatedUser.address).toBe('123 Test St');
    expect(updatedUser.email).toBe(uniqueEmail);
  });

  it('should create banking details when updating user', async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    const user = await createUserRepository.execute('Test User', uniqueEmail);

    const updatedUser = await updateUserRepository.execute(user.id, {
      bankingDetails: {
        agency: '0001',
        accountNumber: '12345-6',
      },
    });

    expect(updatedUser).toBeDefined();

    const foundUser = await findOneUserRepository.execute(user.id);

    expect(foundUser?.bankingDetails).toBeDefined();
    expect(foundUser?.bankingDetails?.agency).toBe('0001');
    expect(foundUser?.bankingDetails?.accountNumber).toBe('12345-6');
  });

  it('should update existing banking details', async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    const user = await createUserRepository.execute('Test User', uniqueEmail);

    await updateUserRepository.execute(user.id, {
      bankingDetails: {
        agency: '0001',
        accountNumber: '12345-6',
      },
    });

    const updatedUser = await updateUserRepository.execute(user.id, {
      bankingDetails: {
        agency: '0002',
        accountNumber: '67890-1',
      },
    });

    expect(updatedUser).toBeDefined();

    const foundUser = await findOneUserRepository.execute(user.id);

    expect(foundUser?.bankingDetails?.agency).toBe('0002');
    expect(foundUser?.bankingDetails?.accountNumber).toBe('67890-1');
  });
});
