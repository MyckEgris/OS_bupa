/**
* AgreementUserVersionsDto.ts
*
* @description: DTO for user versions agreement
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

/**
 * DTO for user versions agreement
 */
export interface AgreementUserVersionsDto {

    /**
     * agreementId
     */
    agreementId: number;

    /**
     * agreementVersionId
     */
    agreementVersionId: number;

    /**
     * isAccepted
     */
    isAccepted: boolean;

    /**
     * refuseNumber
     */
    refuseNumber: number;

    /**
     * dateAccepted
     */
    dateAccepted?: string;

    /**
     * dateRefused
     */
    dateRefused?: string;

    /**
     * createDate
     */
    createDate: any;

    /**
     * retryCount
     */
    retryCount: number;

    /**
     * canUserBeLocked
     */
    canUserBeLocked: boolean;

    /**
     * ipClient
     */
    ipClient: string;
}
