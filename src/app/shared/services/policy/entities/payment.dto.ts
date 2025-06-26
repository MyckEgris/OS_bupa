/**
* PaymentDto.ts
*
* @description: DTO member
* @author Arturo Suarez
* @version 1.0
* @date 10-10-2018.
*
**/

/**
 * DTO member
 */
export interface PaymentDto {
    amount: number;
    currencySymbol: string;
    paymentDate: string;
    paymentMethod: string;
    accountNumber: number;
    confirmationNumber: number;
    reference: string;
    paymentStatus: string;
    policyId: number;
    amountUSDtoPay: number;
    currencySimbol: string;
    paymentDateToShow: string;
    paymentId: number;
    exchangeRate: number;
    issueDate: string;
    paymentMethodId: number;
    paidTo: string;
}
