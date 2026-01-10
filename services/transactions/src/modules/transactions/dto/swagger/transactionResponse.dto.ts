import { ApiProperty } from '@nestjs/swagger';

enum TransactionStatusEnum {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export class TransactionResponseDTO {
  @ApiProperty({
    description: 'Transaction ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Sender user ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  senderUserId: string;

  @ApiProperty({
    description: 'Receiver user ID',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  receiverUserId: string;

  @ApiProperty({
    description: 'Transaction amount in cents',
    example: 10000,
    minimum: 1,
  })
  amount: number;

  @ApiProperty({
    description: 'Transaction description',
    example: 'Service payment',
    required: false,
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Transaction status',
    enum: TransactionStatusEnum,
    example: TransactionStatusEnum.PENDING,
  })
  status: TransactionStatusEnum;

  @ApiProperty({
    description: 'Creation date',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Last update date',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
