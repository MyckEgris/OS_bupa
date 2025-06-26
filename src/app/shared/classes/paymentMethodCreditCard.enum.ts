/**
 *
 */
export enum PaymentMethodCreditCard {
    CREDIT_CARD = 1,
    ONLINE_CREDIT_CARD = 11,
    ONSHORE_MANUAL_CREDIT_CARD = 27,
    MANUAL_CREDIT_CARD = 29,
    MANUAL_CREDIT_CARD_VISA = 31,
    MANUAL_CREDIT_CARD_MASTERCARD = 32,
    MANUAL_CREDIT_CARD_AMERICAN_EXPRESS = 33,
    MANUAL_CREDIT_CARD_DINERS_CLUB = 34,
    CREDIT_CARD_MEXICO = 45,
    CREDIT_CARD_ECUADOR = 50
}

export namespace PaymentMethodCreditCard {
    export function toKeyValueArray (enumType: object) {
        return keys (enumType)
            .map ((key) => {
                return {key, value: enumType [key]};
             });
     }

     function keys(enumType: object) {
        const members = Object.keys(enumType);
        return members.filter((x) => Number.isNaN(parseInt(x, 10)));
    }
}


