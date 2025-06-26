import { CreditCardPaymentData } from './creditCardPaymentData';
import { CheckPaymentData } from './checkPaymentData';

/**
* PaymentDto.ts
*
* @description: DTO member
* @author Arturo Suarez
* @version 1.0
* @date 10-01-2019.
*
**/

/**
 * DTO member
 */
export class PaymentDto {
    payment: PaymentPolicy;
    notification: NotificationPayment;
}

export class PaymentPolicy {
    policy: {
        policyId: string;
        policyReference: string;
        fixedRate: number;
    };
    businessId: number;
    paymentMethodId: number;
    paymentDataCreditCard?: CreditCardPaymentData;
    paymentDataElectronicCheck?: CheckPaymentData;

}

export class NotificationPayment {
    language: string;
    emails: string[];
}
