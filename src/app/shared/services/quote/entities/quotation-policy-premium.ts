import { QuotationPolicyPremiumDetail } from './quotation-policy-premium-detail';
import { QuotationPolicyPremiumMember } from './quotation-policy-premium-member';
import { PremiumByModeOfPayment } from './quotation-policy-premium-payments';

export interface QuotationPolicyPremium {
    premiumId: number;
    modeOfPayment: number;
    price: number;
    planId: number;
    deductibleId: number;
    premiumDetails: Array<QuotationPolicyPremiumDetail>;
    memberPremiums: Array<QuotationPolicyPremiumMember>;
    premiumByModeOfPayments: Array<PremiumByModeOfPayment>;
}
