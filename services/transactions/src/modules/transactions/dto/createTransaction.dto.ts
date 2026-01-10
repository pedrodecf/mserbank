import { createZodDto } from 'nestjs-zod';
import { createTransactionSchema } from '../schemas/createTransaction.schema';

export class CreateTransactionDTO extends createZodDto(createTransactionSchema) {}
