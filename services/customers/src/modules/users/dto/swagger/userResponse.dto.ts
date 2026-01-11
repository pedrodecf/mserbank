import { ApiProperty } from '@nestjs/swagger';

class BankingDetailsResponseDTO {
  @ApiProperty({
    description: 'Banking details ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Bank agency',
    example: '0001',
  })
  agency: string;

  @ApiProperty({
    description: 'Bank account number',
    example: '123456-7',
  })
  accountNumber: string;

  @ApiProperty({
    description: 'Banking details nickname',
    example: 'primary account',
  })
  nickname: string;

  @ApiProperty({
    description: 'Banking details created at',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Banking details updated at',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}

export class UserResponseDTO {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  name: string;

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User address',
    example: '123 Main Street',
    required: false,
    nullable: true,
  })
  address: string | null;

  @ApiProperty({
    description: 'Profile picture URL',
    example: 'https://example.com/profile.jpg',
    required: false,
    nullable: true,
  })
  profilePicture: string | null;

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

  @ApiProperty({
    description: 'Deletion date (soft delete)',
    example: null,
    required: false,
    nullable: true,
  })
  deletedAt: Date | null;

  @ApiProperty({
    description: 'User banking details',
    type: BankingDetailsResponseDTO,
    required: false,
    nullable: true,
  })
  bankingDetails: BankingDetailsResponseDTO | null;
}
