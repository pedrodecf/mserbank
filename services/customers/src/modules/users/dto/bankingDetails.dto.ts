import { createZodDto } from 'nestjs-zod';
import { bankingDetailsSchema } from '../schemas/bankingDetails.schema';

export class BankingDetailsDTO extends createZodDto(bankingDetailsSchema) {}
