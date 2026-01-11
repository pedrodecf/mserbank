import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CreateTransactionRepository } from '../repositories/createTransaction.repository';
import { FindTransactionsByUserService } from './findTransactionsByUser.service';

describe('FindTransactionsByUserService Integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let findTransactionsByUserService: FindTransactionsByUserService;
  let createTransactionRepository: CreateTransactionRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    findTransactionsByUserService = moduleFixture.get<FindTransactionsByUserService>(
      FindTransactionsByUserService,
    );
    createTransactionRepository = moduleFixture.get<CreateTransactionRepository>(
      CreateTransactionRepository,
    );
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.transaction.deleteMany({});
  });

  it('should find all transactions for a user as sender', async () => {
    await createTransactionRepository.execute({
      senderUserId: 'user-1',
      receiverUserId: 'user-2',
      amount: 10050,
      description: 'Transaction 1',
    });

    await createTransactionRepository.execute({
      senderUserId: 'user-1',
      receiverUserId: 'user-3',
      amount: 5000,
      description: 'Transaction 2',
    });

    const transactions = await findTransactionsByUserService.execute('user-1');

    expect(transactions).toBeDefined();
    expect(transactions.length).toBe(2);
    expect(
      transactions.every((t) => t.senderUserId === 'user-1' || t.receiverUserId === 'user-1'),
    ).toBe(true);
  });

  it('should find all transactions for a user as receiver', async () => {
    await createTransactionRepository.execute({
      senderUserId: 'user-1',
      receiverUserId: 'user-2',
      amount: 10050,
      description: 'Transaction 1',
    });

    await createTransactionRepository.execute({
      senderUserId: 'user-3',
      receiverUserId: 'user-2',
      amount: 5000,
      description: 'Transaction 2',
    });

    const transactions = await findTransactionsByUserService.execute('user-2');

    expect(transactions).toBeDefined();
    expect(transactions.length).toBe(2);
    expect(transactions.every((t) => t.receiverUserId === 'user-2')).toBe(true);
  });

  it('should find transactions where user is both sender and receiver', async () => {
    await createTransactionRepository.execute({
      senderUserId: 'user-1',
      receiverUserId: 'user-2',
      amount: 10050,
    });

    await createTransactionRepository.execute({
      senderUserId: 'user-2',
      receiverUserId: 'user-1',
      amount: 5000,
    });

    const transactions = await findTransactionsByUserService.execute('user-1');

    expect(transactions.length).toBeGreaterThanOrEqual(2);
    expect(transactions.some((t) => t.senderUserId === 'user-1')).toBe(true);
    expect(transactions.some((t) => t.receiverUserId === 'user-1')).toBe(true);
  });

  it('should return empty array when user has no transactions', async () => {
    const transactions = await findTransactionsByUserService.execute('user-999');

    expect(transactions).toBeDefined();
    expect(transactions.length).toBe(0);
  });
});
