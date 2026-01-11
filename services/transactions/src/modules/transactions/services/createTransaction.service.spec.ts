import { BadRequestException, ForbiddenException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Transaction, TransactionStatus } from '@prisma/client';
import { CreateTransactionDTO } from '../dto/createTransaction.dto';
import { TransactionCreatedProducer } from '../producers/transactionCreated.producer';
import { CreateTransactionRepository } from '../repositories/createTransaction.repository';
import { CreateTransactionService } from './createTransaction.service';

describe('CreateTransactionService', () => {
  let service: CreateTransactionService;
  let mockCreateTransactionRepository: { execute: jest.Mock };
  let mockTransactionCreatedProducer: { emit: jest.Mock };

  const mockTransaction: Transaction = {
    id: 'transaction-123',
    senderUserId: 'user-1',
    receiverUserId: 'user-2',
    amount: 10050,
    description: 'Test transaction',
    status: TransactionStatus.PENDING,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreateTransactionDTO: CreateTransactionDTO = {
    senderUserId: 'user-1',
    receiverUserId: 'user-2',
    amount: 100.5,
    description: 'Test transaction',
  };

  beforeEach(async () => {
    mockCreateTransactionRepository = {
      execute: jest.fn(),
    };

    mockTransactionCreatedProducer = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTransactionService,
        {
          provide: CreateTransactionRepository,
          useValue: mockCreateTransactionRepository,
        },
        {
          provide: TransactionCreatedProducer,
          useValue: mockTransactionCreatedProducer,
        },
      ],
    }).compile();

    service = module.get<CreateTransactionService>(CreateTransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a transaction successfully', async () => {
    mockCreateTransactionRepository.execute.mockResolvedValue(mockTransaction);

    const result = await service.execute(mockCreateTransactionDTO, 'user-1');

    expect(result).toEqual(mockTransaction);
    expect(mockCreateTransactionRepository.execute).toHaveBeenCalledWith(mockCreateTransactionDTO);
    expect(mockTransactionCreatedProducer.emit).toHaveBeenCalledWith({
      transactionId: mockTransaction.id,
      senderUserId: mockTransaction.senderUserId,
      receiverUserId: mockTransaction.receiverUserId,
      amount: mockTransaction.amount,
      description: mockTransaction.description,
    });
  });

  it('should throw BadRequestException when sender and receiver are the same', async () => {
    const invalidDTO: CreateTransactionDTO = {
      ...mockCreateTransactionDTO,
      receiverUserId: 'user-1',
    };

    await expect(service.execute(invalidDTO, 'user-1')).rejects.toThrow(BadRequestException);
    expect(mockCreateTransactionRepository.execute).not.toHaveBeenCalled();
    expect(mockTransactionCreatedProducer.emit).not.toHaveBeenCalled();
  });

  it('should throw ForbiddenException when currentUserId does not match senderUserId', async () => {
    await expect(service.execute(mockCreateTransactionDTO, 'user-3')).rejects.toThrow(
      ForbiddenException,
    );
    expect(mockCreateTransactionRepository.execute).not.toHaveBeenCalled();
    expect(mockTransactionCreatedProducer.emit).not.toHaveBeenCalled();
  });
});
