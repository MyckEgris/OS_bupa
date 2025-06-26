/**
* CardDTO.ts
*
* @description: Documents of policy's members
* @author Andres Tamayo
* @date 11-02-2019.
*
**/

export interface DocumentOutputDto {
    policyId: number;
    documentPath: string;
    documentType: string;
    eligibilityDate: string;
    documentLanguage: number;
    lastSentDate: string;
}
