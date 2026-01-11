import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { LoginService } from './login.service';
import { RegisterService } from './register.service';

describe('LoginService Integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let loginService: LoginService;
  let registerService: RegisterService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    loginService = moduleFixture.get<LoginService>(LoginService);
    registerService = moduleFixture.get<RegisterService>(RegisterService);
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

  it('should login successfully with valid credentials', async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    await registerService.execute({
      name: 'Test User',
      email: uniqueEmail,
      password: 'password123',
    });

    const result = await loginService.execute({
      email: uniqueEmail,
      password: 'password123',
    });

    expect(result).toBeDefined();
    expect(result.accessToken).toBeDefined();
    expect(result.user).toBeDefined();
    expect(result.user.email).toBe(uniqueEmail);
    expect(result.user.name).toBe('Test User');
  });

  it('should not login with invalid password', async () => {
    const uniqueEmail = `test-${Date.now()}@example.com`;
    await registerService.execute({
      name: 'Test User',
      email: uniqueEmail,
      password: 'password123',
    });

    await expect(
      loginService.execute({
        email: uniqueEmail,
        password: 'wrongpassword',
      }),
    ).rejects.toThrow();
  });

  it('should not login with non-existent email', async () => {
    await expect(
      loginService.execute({
        email: 'nonexistent@example.com',
        password: 'password123',
      }),
    ).rejects.toThrow();
  });
});
