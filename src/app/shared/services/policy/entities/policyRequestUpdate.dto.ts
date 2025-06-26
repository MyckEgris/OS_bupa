/**
* CardDTO.ts
*
* @description: Documents of policy's members
* @author Andres Tamayo
* @date 11-02-2019.
*
**/
export interface PolicyRequestUpdate {
    policyId: number;
    language: string;
    sendDocuments: boolean;
    email: string;
    postalCode: string;

}
