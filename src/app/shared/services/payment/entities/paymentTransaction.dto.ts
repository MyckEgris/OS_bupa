import { PaymentPolicyTransactionDto } from './paymentPolicyTransaction.dto';
import { PaymentCreditCardTransactionDto } from './paymentCreditCardTransaction.dto';
import { PaymentCreditCardCheckTransactionDto } from './paymentCreditCardCheckTransaction.dto';

/**
* payment transaction  DTO.ts
*
* @description: payment transaction
* @author Edwin Javier Sanabria Mesa
* @date 26-05-2020.
*
**/
export interface PaymentTransactionDto {
    paymentId: number;
    transactionLogId: string;
    paymentGatewayId: string;
    policyId: number;
    premiumId: number;
    number: string;
    policy: PaymentPolicyTransactionDto;
    businessId: number;
    paymentMethodId: number;
    paymentDataCreditCard: PaymentCreditCardTransactionDto;
    paymentDataElectronicCheck: PaymentCreditCardCheckTransactionDto;
    authorizationCode: string;
}
