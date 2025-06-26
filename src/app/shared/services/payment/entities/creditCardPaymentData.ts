/**
* CreditCardPaymentData.ts
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
export interface CreditCardPaymentData {

    creditCardTypeId: number;
    accountFirstName: string;
    accountLastName: string;
    cardNumber: string;
    expirationMonth: number;
    expirationYear: number;
    currencyId: number;
    amountApplyUSD: number;
    cvc?: string;
    exchangeRate: number;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
}
