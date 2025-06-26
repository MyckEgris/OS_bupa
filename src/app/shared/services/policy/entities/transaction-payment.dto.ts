import { TransactionPolicyDto } from './transaction-policy.dto';
import { TransactionPaymentCreditCardDto } from './transaction-payment-creditcard.dto';
import { TransactionPaymentElectronicCheckDto } from './transaction-payment-electronic-check.dto';

/**
* payment transaction  DTO.ts
*
* @description: payment transaction
* @author Juan Camilo Moreno
* @date 22-05-2020.
*
**/
export interface TransactionPaymentDto {
    paymentId: number;
    transactionLogId: number;
    policyId: number;
    policy: TransactionPolicyDto;
    businessId: number;
    paymentMethod: number;
    paymentDataCreditCard: TransactionPaymentCreditCardDto;
    paymentDataElectronicCheck?: TransactionPaymentElectronicCheckDto;
    authorizationCode?: any;
    browser: string;
    clientIp: string;
    domainId: number;
}
