import { PaymentResponseDto } from './paymentResponse.dto';

/**
* PaymentResponseTransactionDto.ts
*
* @description: DTO member
* @author Edwin Javier Sanabria Mesa
* @version 1.0
* @date 26-05-2020.
*
**/

export interface PaymentResponseTransactionDto {
    transactionLogId: string;
    policyIdtransactionFingerKey: string;
    transactionExternalKey: string;
    transactionUrl: string;
    paymentResponse: PaymentResponseDto;
}
