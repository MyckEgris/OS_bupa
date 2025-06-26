export interface ClaimResponse {
    claimsListLogId: number,
    claimHeaderId: number;
    duplicateClaimHeaderId: number;
    message: string;
    newClaim: boolean;
    trackingNumber: string;
    resolutionDate: string;
    paymentDate: string;
}