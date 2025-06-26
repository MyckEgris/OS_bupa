import { TransactionPaymentDto } from './transaction-payment.dto';
import { TransactionPlanDto } from './transaction-plan.dto';

/**
* payment transaction  DTO.ts
*
* @description: payment transaction
* @author Juan Camilo Moreno
* @date 22-05-2020.
*
**/
export interface TransactionDto {
    transactionMode: number;
    transactionLogId: number;
    transactionFingerKey: string;
    transactionExternalKey: string;
    transactionUrl: string;
    transactionKey: string;
    payment: TransactionPaymentDto;
    plan: TransactionPlanDto;
}
