/**
* UserOutputDto.ts
*
* @description: DTO user response
* @author Juan Camilo Moreno
* @version 1.0
* @date 17-09-2018.
*
**/

import { UserAgreementVersionOutputDto } from './user-agreement-version-output.dto';
import { UserInRolesDto } from './user-in-roles.dto';

/**
 * DTO user response
 */
export interface UserOutputDto {
    /**
     * id
     */
    id: string;

    /**
     * name
     */
    name: string;

    /**
     * firstName
     */
    firstName: string;

    /**
     * middleName
     */
    middleName: string;

    /**
     * lastName
     */
    lastName: string;

    /**
     * userAgreementVersionsDto: Array<UserAgreementVersionOutputDto>
     */
    userAgreementVersionsDto: Array<UserAgreementVersionOutputDto>;

    /**
     * dateOfBirth
     */
    dateOfBirth: Date;

    /**
     * previousConnection
     */
    previousConnection?: Date;

    /**
     * position
     */
    position: string;

    /**
     * phoneNumber
     */
    phoneNumber: string;

    /**
     * isEnabled
     */
    isEnabled: boolean;

    /**
     * userInRoles: Array<UserInRolesDto>
     */
    userInRoles: Array<UserInRolesDto>;

    isLockedOut: boolean;
    isApproved: boolean;
}
