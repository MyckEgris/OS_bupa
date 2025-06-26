import { PlanPaymentTransactionDto } from './planPaymentTransaction.dto';

/**
* payment transaction  DTO.ts
*
* @description: payment transaction
* @author Edwin Javier Sanabria Mesa
* @date 28-05-2020.
*
**/
export interface PaymentPolicyTransactionDto {

    policyId: number;
    policyReference: string;
    fixedRate: number;
    firstName: string;
    middleName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    plan: PlanPaymentTransactionDto;
    modeOfPayment: string;
}
