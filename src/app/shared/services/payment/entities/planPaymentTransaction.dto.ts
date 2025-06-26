import { PaymentPolicyTransactionDto } from './paymentPolicyTransaction.dto';
import { PaymentCreditCardTransactionDto } from './paymentCreditCardTransaction.dto';
import { PaymentCreditCardCheckTransactionDto } from './paymentCreditCardCheckTransaction.dto';

/**
* payment transaction  DTO.ts
*
* @description: payment transaction
* @author Edwin Javier Sanabria Mesa
* @date 07-06-2020.
*
**/
export interface PlanPaymentTransactionDto {
    id: number;
    name: string;
    description: string;
    productId: number;
}
