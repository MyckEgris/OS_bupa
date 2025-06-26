export enum TypeCreditCard {
    VISA = 1,
    MASTERCARD = 2,
    AMEX = 3,
    DINERS = 4,
    DISCOVER = 5

}

export namespace TypeCreditCard {
    export function getDescription(typeCard: TypeCreditCard): string {
        if (typeCard === TypeCreditCard.VISA) {
            return 'Visa';
        } else if (typeCard === TypeCreditCard.MASTERCARD) {
            return 'Mastercard';
        } else if (typeCard === TypeCreditCard.AMEX) {
            return 'American Express';
        } else if (typeCard === TypeCreditCard.DINERS) {
            return 'Diners Club';
        } else if (typeCard === TypeCreditCard.DISCOVER) {
            return 'Discover';
        } else {
            return null;
        }
    }

}
