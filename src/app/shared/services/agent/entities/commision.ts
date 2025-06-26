export interface Commission {
    commissionType: string;
    groupId: number;
    groupName: string;
    policyType: number;
    policyTypeName: string;
    eligibilityDate: Date;
    previousPolicyId: number;
    commissionDescription: string;
    policyReferenceId: number;
    paymentMethod: string;
    paymentMethodId: string;
    policyOwnerFullName: string;
    commissionablePremiumValue: number;
    commissionPercentage: number;
    commissionTotal: number;
    agentName: string;
    currencyCode: string;
    paymentNumber: number;
    invoiceNbr: string;
    subtotal?: number;
    iva?: number;
    retentionIVA?: number;
    retentionISR?: number;
}
