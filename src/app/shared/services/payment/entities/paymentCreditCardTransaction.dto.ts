/**
* payment transaction  DTO.ts
*
* @description: payment transaction
* @author Edwin Javier Sanabria Mesa
* @date 28-05-2020.
*
**/
export interface PaymentCreditCardTransactionDto {
    accountFirstName: string;
    accountLastName: string;
    creditCardTypeId: any;
    cardNumber: string;
    expirationMonth: number;
    expirationYear: number;
    amountApply: number;
    amountApplyUSD: number;
    currencyId: number;
    currencySymbolIso3: string;
    isPrimary: boolean;
    isOneTime: boolean;
    ExchangeRate: number;
    AutomaticDeduction: boolean;
}
