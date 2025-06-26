import { RiderByLanguage } from './rider-by-language';

export interface Rider {
    riderId: number;
    policyId: number;
    memberId: number;
    description: string;
    descriptionEs: string;
    descriptionEn: string;
    amount: number;
    currencyCode: string;
    // riderByLanguage: RiderByLanguage[];
}
