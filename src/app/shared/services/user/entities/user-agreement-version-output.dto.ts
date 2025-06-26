/**
* UserAgreementVersionOutputDto.ts
*
* @description: DTO user agreement version response
* @author Juan Camilo Moreno
* @version 1.0
* @date 17-09-2018.
*
**/

/**
 * DTO user agreement version response
 */
export interface UserAgreementVersionOutputDto {

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
     * createDate
     */
    createDate: any;
}
