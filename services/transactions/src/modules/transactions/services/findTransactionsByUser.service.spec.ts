import { Test, TestingModule } from '@nestjs/testing';
import { Transaction, TransactionStatus } from '@prisma/client';
import { FindTransactionsByUserRepository } from '../repositories/findTransactionsByUser.repository';
import { FindTransactionsByUserService } from './findTransactionsByUser.service';

describe('FindTransactionsByUserService', () => {
  let service: FindTransactionsByUserService;
  let mockFindTransactionsByUserRepository: { execute: jest.Mock };

  const mockTransactions: Transaction[] = [
    {
      id: 'transaction-1',
      senderUserId: 'user-1',
      receiverUserId: 'user-2',
      amount: 100,
      description: 'Transaction 1',
      status: TransactionStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'transaction-2',
      senderUserId: 'user-2',
      receiverUserId: 'user-1',
      amount: 50,
      description: 'Transaction 2',
      status: TransactionStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  beforeEach(async () => {
    mockFindTransactionsByUserRepository = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindTransactionsByUserService,
        {
          provide: FindTransactionsByUserRepository,
          useValue: mockFindTransactionsByUserRepository,
        },
      ],
    }).compile();

    service = module.get<FindTransactionsByUserService>(FindTransactionsByUserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return transactions when found', async () => {
    mockFindTransactionsByUserRepository.execute.mockResolvedValue(mockTransactions);

    const result = await service.execute('user-1');

    expect(result).toEqual(mockTransactions);
    expect(mockFindTransactionsByUserRepository.execute).toHaveBeenCalledWith('user-1');
  });

  it('should return empty array when no transactions found', async () => {
    mockFindTransactionsByUserRepository.execute.mockResolvedValue([]);

    const result = await service.execute('user-1');

    expect(result).toEqual([]);
    expect(mockFindTransactionsByUserRepository.execute).toHaveBeenCalledWith('user-1');
  });
});
