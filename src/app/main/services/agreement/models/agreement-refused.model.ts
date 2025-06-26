/**
* AgreementRefusedModel.ts
*
* @description: Model for refused agreements
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/
import { AgreementUserDto } from './agreement-user.dto';

/**
 * Model for refused agreements
 */
export interface AgreementRefusedModel {
    /**
     * agreementId
     */
    agreementId: number;

    /**
     * isAccepted
     */
    isAccepted: boolean;

    /**
     * refuseNumber
     */
    refuseNumber: number;

    /**
     * language
     */
    language: string;

    /**
     * agreementName
     */
    agreementName: string;

    /**
     * retryCount
     */
    retryCount: number;

    /**
     * canUserBeLocked
     */
    canUserBeLocked: boolean;

    /**
     * hideButtonLastRetry
     */
    hideButtonLastRetry: boolean;

    /**
     * title
     */
    title: string;

    /**
     * agreementUserDto
     */
    agreementUserDto: AgreementUserDto;
}
