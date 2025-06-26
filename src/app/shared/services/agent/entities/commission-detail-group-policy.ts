import { CommissionDetailPolicy } from './commission-detail-policy';

export interface CommissionDetailGroupPolicy {
    groupId: number;
    groupName: string;
    subtotal: number;
    currencyCode: string;
    details: Array<CommissionDetailPolicy>;
}
