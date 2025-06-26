export interface CommissionFilterObject {
    index: number;
    date: Date;
    paymentType: Array<PaymentType>;
}

export interface PaymentType {
    typeId: number;
    typeName: string;
}
