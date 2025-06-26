import { PaymentTransactionDto } from './paymentTransaction.dto';

/**
* payment transaction  DTO.ts
*
* @description: payment transaction
* @author Edwin Javier Sanabria Mesa
* @date 26-05-2020.
*
**/
export interface TransactionDto {
    transactionMode: number;
    transactionLogId: string;
    transactionFingerKey: string;
    transactionExternalKey: string;
    transactionStatusId?: number;
    transactionMessage: string;
    transactionErrorCode: string;
    transactionUrl?: string;
    language?: string;
    payment: PaymentTransactionDto;
}
