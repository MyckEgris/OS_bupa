/**
* CheckPaymentData.ts
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
export interface CheckPaymentData {

    accountFirstName: string;
    accountLastName: string;
    amountApplyUSD: number;
    accountNumber: string;
    routingNumber: string;
    exchangeRate: number;
    currencyId: number;
}
