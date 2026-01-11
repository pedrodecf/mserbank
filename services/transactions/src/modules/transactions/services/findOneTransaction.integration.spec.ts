import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../../app.module';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CreateTransactionRepository } from '../repositories/createTransaction.repository';
import { FindOneTransactionService } from './findOneTransaction.service';

describe('FindOneTransactionService Integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let findOneTransactionService: FindOneTransactionService;
  let createTransactionRepository: CreateTransactionRepository;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    findOneTransactionService =
      moduleFixture.get<FindOneTransactionService>(FindOneTransactionService);
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

  it('should find transaction when user is the sender', async () => {
    const transaction = await createTransactionRepository.execute({
      senderUserId: 'user-1',
      receiverUserId: 'user-2',
      amount: 10050,
      description: 'Test transaction',
    });

    const foundTransaction = await findOneTransactionService.execute(transaction.id, 'user-1');

    expect(foundTransaction).toBeDefined();
    expect(foundTransaction.id).toBe(transaction.id);
    expect(foundTransaction.senderUserId).toBe('user-1');
    expect(foundTransaction.receiverUserId).toBe('user-2');
  });

  it('should find transaction when user is the receiver', async () => {
    const transaction = await createTransactionRepository.execute({
      senderUserId: 'user-1',
      receiverUserId: 'user-2',
      amount: 10050,
      description: 'Test transaction',
    });

    const foundTransaction = await findOneTransactionService.execute(transaction.id, 'user-2');

    expect(foundTransaction).toBeDefined();
    expect(foundTransaction.id).toBe(transaction.id);
  });

  it('should not find transaction when user is not sender or receiver', async () => {
    const transaction = await createTransactionRepository.execute({
      senderUserId: 'user-1',
      receiverUserId: 'user-2',
      amount: 10050,
    });

    await expect(findOneTransactionService.execute(transaction.id, 'user-3')).rejects.toThrow();
  });

  it('should not find non-existent transaction', async () => {
    await expect(findOneTransactionService.execute('non-existent-id', 'user-1')).rejects.toThrow();
  });
});
