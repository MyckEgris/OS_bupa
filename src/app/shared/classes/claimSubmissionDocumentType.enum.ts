export enum ClaimSubmissionDocumentTypeName {
    BANK_INFORMATION = 'BANK_INFORMATION',
    CLAIM_BILL = 'CLAIM_BILL',
    CLAIM_DUCUMENTS = 'CLAIM_DUCUMENTS',
    MEDICAL_RECORDS = 'MEDICAL_RECORDS'
}

export namespace ClaimSubmissionDocumentType {
    export function getTypeDescription(documentTypeName: string): string {
        switch (documentTypeName) {
            case ClaimSubmissionDocumentTypeName.BANK_INFORMATION:
                return 'Bank Information';
            case ClaimSubmissionDocumentTypeName.CLAIM_BILL:
                return 'Claim Bill';
            case ClaimSubmissionDocumentTypeName.CLAIM_DUCUMENTS:
                return 'Claim Documents';
            case ClaimSubmissionDocumentTypeName.MEDICAL_RECORDS:
                return 'Medical Records';
            default:
                break;
        }
    }

    export function getTypeId(documentTypeName: string): number {
        switch (documentTypeName) {
            case ClaimSubmissionDocumentTypeName.BANK_INFORMATION:
                return 1;
            case ClaimSubmissionDocumentTypeName.CLAIM_BILL:
                return 2;
            case ClaimSubmissionDocumentTypeName.CLAIM_DUCUMENTS:
                return 3;
            case ClaimSubmissionDocumentTypeName.MEDICAL_RECORDS:
                return 4;
            default:
                break;
        }
    }

}



