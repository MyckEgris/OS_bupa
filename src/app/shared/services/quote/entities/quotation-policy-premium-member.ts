import { QuotationPolicyPremiumDetail } from './quotation-policy-premium-detail';

export interface QuotationPolicyPremiumMember {
    MemberNumber: number;
    PremiumDetails: Array<QuotationPolicyPremiumDetail>;
}
