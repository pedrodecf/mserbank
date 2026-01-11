import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Transaction, TransactionStatus } from '@prisma/client';
import { FindOneTransactionRepository } from '../repositories/findOneTransaction.repository';
import { FindOneTransactionService } from './findOneTransaction.service';

describe('FindOneTransactionService', () => {
  let service: FindOneTransactionService;
  let mockFindOneTransactionRepository: { execute: jest.Mock };

  const mockTransaction: Transaction = {
    id: 'transaction-123',
    senderUserId: 'user-1',
    receiverUserId: 'user-2',
    amount: 100,
    description: 'Test transaction',
    status: TransactionStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    mockFindOneTransactionRepository = {
      execute: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindOneTransactionService,
        {
          provide: FindOneTransactionRepository,
          useValue: mockFindOneTransactionRepository,
        },
      ],
    }).compile();

    service = module.get<FindOneTransactionService>(FindOneTransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return transaction when user is the sender', async () => {
    mockFindOneTransactionRepository.execute.mockResolvedValue(mockTransaction);

    const result = await service.execute('transaction-123', 'user-1');

    expect(result).toEqual(mockTransaction);
    expect(mockFindOneTransactionRepository.execute).toHaveBeenCalledWith('transaction-123');
  });

  it('should return transaction when user is the receiver', async () => {
    mockFindOneTransactionRepository.execute.mockResolvedValue(mockTransaction);

    const result = await service.execute('transaction-123', 'user-2');

    expect(result).toEqual(mockTransaction);
    expect(mockFindOneTransactionRepository.execute).toHaveBeenCalledWith('transaction-123');
  });

  it('should throw NotFoundException when transaction does not exist', async () => {
    mockFindOneTransactionRepository.execute.mockResolvedValue(null);

    await expect(service.execute('transaction-123', 'user-1')).rejects.toThrow(NotFoundException);
    expect(mockFindOneTransactionRepository.execute).toHaveBeenCalledWith('transaction-123');
  });

  it('should throw NotFoundException when user is not sender or receiver', async () => {
    mockFindOneTransactionRepository.execute.mockResolvedValue(mockTransaction);

    await expect(service.execute('transaction-123', 'user-3')).rejects.toThrow(NotFoundException);
    expect(mockFindOneTransactionRepository.execute).toHaveBeenCalledWith('transaction-123');
  });
});
