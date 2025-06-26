export interface TransactionPaymentCreditCardDto {
    creditCardTypeId: number;
    cardNumber: string;
    expirationMonth: number;
    expirationYear: number;
    cvc: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    automaticDeduction: boolean;
}
