import { Commission } from './commision';

export interface CommissionPayment {
    paymentDate: Date;
    paymentId: number;
    paymentNumber: number;
    paymentTotal: number;
    paymentType: number;
    paymentTypeName: string;
    commissions: Array<Commission>;
}
