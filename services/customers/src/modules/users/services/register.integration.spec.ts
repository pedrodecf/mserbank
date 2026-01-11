import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { AppModule } from '../../../app.module';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { FindUserByEmailRepository } from '../repositories/findUserByEmail.repository';
import { RegisterService } from './register.service';

describe('RegisterService Integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let registerService: RegisterService;
  let findUserByEmailRepository: FindUserByEmailRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    registerService = moduleFixture.get<RegisterService>(RegisterService);
    findUserByEmailRepository =
      moduleFixture.get<FindUserByEmailRepository>(FindUserByEmailRepository);
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
  });

  it('should register a new user with password', async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    const result = await registerService.execute({
      name: 'Test User',
      email: uniqueEmail,
      password: 'password123',
    });

    expect(result).toEqual({ message: 'User created successfully' });

    const user = await findUserByEmailRepository.execute(uniqueEmail);
    expect(user).toBeDefined();
    expect(user?.name).toBe('Test User');
    expect(user?.email).toBe(uniqueEmail);

    // Verificar se a senha foi criada
    const password = await prisma.usersPassword.findUnique({
      where: { id: user?.id },
    });
    expect(password).toBeDefined();
    expect(password?.hash).toBeDefined();

    // Verificar se a senha foi hasheada
    const isPasswordHashed = await bcrypt.compare('password123', password?.hash || '');
    expect(isPasswordHashed).toBe(true);
  });

  it('should not register user with duplicate email', async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    await registerService.execute({
      name: 'Test User',
      email: uniqueEmail,
      password: 'password123',
    });

    await expect(
      registerService.execute({
        name: 'Another User',
        email: uniqueEmail,
        password: 'password456',
      }),
    ).rejects.toThrow();
  });
});
