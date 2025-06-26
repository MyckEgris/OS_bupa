import { CommissionDetailConcept } from './commission-detail-concept';

export interface CommissionDetailSummary {
    referenceNumber: string;
    amount: number;
    currencyCode: string;
    commissionDetailConcepts: Array<CommissionDetailConcept>;
}
