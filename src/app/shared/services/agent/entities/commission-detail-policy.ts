export interface CommissionDetailPolicy {
    commissionType: string;
    eligibilityDate: Date;
    previousPolicyId: string;
    commissionDescription: string;
    policyReferenceId: string;
    policyId: number;
    paymentMethod: string;
    paymentMethodId: string;
    policyOwnerFullName: string;
    commissionablePremiumValue: number;
    commissionPercentage: number;
    commissionTotal: number;
    agentName: string;
    agentId: number;
    currencyCode: string;
    invoiceNbr: string;
    subtotal?: number;
    iva?: number;
    retentionIVA?: number;
    retentionISR?: number;
}
