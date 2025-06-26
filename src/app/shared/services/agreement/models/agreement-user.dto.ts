/**
* AgreementUserDto.ts
*
* @description: DTO for user
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

import { AgreementUserVersionsDto } from './agreement-user-version.dto';

/**
 * DTO for user
 */
export interface AgreementUserDto {

    /**
     * id
     */
    id: string;

    /**
     * name
     */
    name: string;

    /**
     * userAgreementVersionsDto: Array<AgreementUserVersionsDto>
     */
    userAgreementVersionsDto: Array<AgreementUserVersionsDto>;
}
