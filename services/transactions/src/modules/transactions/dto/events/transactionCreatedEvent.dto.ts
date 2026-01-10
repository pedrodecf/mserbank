export class TransactionCreatedEventDTO {
  transactionId: string;
  senderUserId: string;
  receiverUserId: string;
  amount: number;
  description?: string;
}
