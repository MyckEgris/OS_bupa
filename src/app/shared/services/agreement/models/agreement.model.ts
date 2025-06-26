/**
* Agreement.ts
*
* @description: Model for agreement
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

import { AgreementRoleDto } from './agreement-roles.dto';

/**
 * Model for agreement
 */
export interface Agreement {

    /**
     * agreementId
     */
    agreementId: number;

    /**
     * agreementVersionId
     */
    agreementVersionId: number;

    /**
     * canUserBeLocked
     */
    canUserBeLocked: boolean;

    /**
     * hideButtonLastRetry
     */
    hideButtonLastRetry: boolean;

    /**
     * retryCount
     */
    retryCount: number;

    /**
     * version
     */
    version: string;

    /**
     * agreementUrl
     */
    agreementUrl: string;

    /**
     * agreementLanguage
     */
    agreementLanguage: string;

    /**
     * title
     */
    title: string;

    /**
     * priority
     */
    priority: number;

    /**
     * roleAgreementsOutputDto: Array<AgreementRoleDto>
     */
    roleAgreementsOutputDto: Array<AgreementRoleDto>;

     /**
     * messageToCheck
     */
      messageToCheck: string;
}
