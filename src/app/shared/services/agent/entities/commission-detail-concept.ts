import { CommissionDetailGroupPolicy } from './commission-detail-group-policy';
import { CommissionDetailPolicy } from './commission-detail-policy';



export interface CommissionDetailConcept {
    conceptName: string;
    conceptId: number;
    groupId: number;
    groupName: string;
    subtotal: number;
    currencyCode: string;

    commissionDetailGroup: Array<CommissionDetailGroupPolicy>;
}
