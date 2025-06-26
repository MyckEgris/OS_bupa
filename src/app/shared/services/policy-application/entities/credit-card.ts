export interface CreditCard {
  applicationCreditCardGuid: string;
  applicationGuid: string;
  creditCardNumber: string;
  creditCardTypeId: number;
  expirationMonth: number;
  expirationYear: number;
  securityCode: string;
  cardHolderName: string;
  cardHolderAddress: string;
  cardHolderEmail: string;
  relationTypeId: number;
}
