import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionStatus } from '@prisma/client';
import { AppModule } from '../../../app.module';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { CreateTransactionService } from './createTransaction.service';

describe('CreateTransactionService Integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let createTransactionService: CreateTransactionService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
    createTransactionService =
      moduleFixture.get<CreateTransactionService>(CreateTransactionService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    await prisma.transaction.deleteMany({});
  });

  it('should create a transaction in the database', async () => {
    const transaction = await createTransactionService.execute(
      {
        senderUserId: 'user-1',
        receiverUserId: 'user-2',
        amount: 100.5,
        description: 'Test transaction',
      },
      'user-1',
    );

    expect(transaction).toBeDefined();
    expect(transaction.id).toBeDefined();
    expect(transaction.senderUserId).toBe('user-1');
    expect(transaction.receiverUserId).toBe('user-2');
    expect(transaction.description).toBe('Test transaction');
    expect(transaction.status).toBe(TransactionStatus.PENDING);

    // Verificar no banco
    const dbTransaction = await prisma.transaction.findUnique({
      where: { id: transaction.id },
    });
    expect(dbTransaction).toBeDefined();
    expect(dbTransaction?.senderUserId).toBe('user-1');
  });

  it('should not create transaction when sender and receiver are the same', async () => {
    await expect(
      createTransactionService.execute(
        {
          senderUserId: 'user-1',
          receiverUserId: 'user-1',
          amount: 100.5,
        },
        'user-1',
      ),
    ).rejects.toThrow();
  });

  it('should not create transaction when currentUserId does not match senderUserId', async () => {
    await expect(
      createTransactionService.execute(
        {
          senderUserId: 'user-1',
          receiverUserId: 'user-2',
          amount: 100.5,
        },
        'user-3',
      ),
    ).rejects.toThrow();
  });
});
