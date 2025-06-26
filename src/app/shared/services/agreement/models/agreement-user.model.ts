/**
* AgreementUser.ts
*
* @description: Model for user
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

import { AgreementUserVersionsDto } from './agreement-user-version.dto';

/**
 * Model for user
 */
export interface AgreementUser {

    /**
     * id
     */
    id: string;

    /**
     * name
     */
    name?: string;

    /**
     * firstName
     */
    firstName?: string;

    /**
     * lastName
     */
    lastName?: string;

    /**
     * userAgreementVersionsDto: Array<AgreementUserVersionsDto>
     */
    userAgreementVersionsDto: Array<AgreementUserVersionsDto>;
}
