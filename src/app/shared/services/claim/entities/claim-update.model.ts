export interface ClaimUpdateModel {
    claimDetailId: number;
    openClaim: boolean;
    documents: Array<any>;
    insuranceBusinessId: number;
    memberId: number;
    memberFirstName: string;
    memberLastName: string;
    policyId: number;
    headerId: number;
    groupId: number;
    isGroupPolicy: boolean;
}
