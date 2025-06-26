import { PaymentResponseDto } from './paymentResponse.dto';

export interface TransactionResponseDto {
    transactionLogId: string;
    policyIdtransactionFingerKey: string;
    transactionExternalKey: string;
    transactionUrl: string;
    transactionStatusId: number;
    transactionErrorCode: string;
    transactionMessage: string;
    payment: PaymentResponseDto;
}
