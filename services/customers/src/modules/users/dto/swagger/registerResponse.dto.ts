import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDTO {
  @ApiProperty({
    description: 'Success message',
    example: 'User created successfully',
  })
  message: string;
}
