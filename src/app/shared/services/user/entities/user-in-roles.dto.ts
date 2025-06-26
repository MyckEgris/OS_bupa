/**
* UserInRolesDto.ts
*
* @description: DTO user in roles
* @author Juan Camilo Moreno
* @version 1.0
* @date 17-09-2018.
*
**/

import { RoleByBupaInsuranceDto } from './role-by-bupaInsurance.dto';

/**
 * DTO user in roles
 */
export interface UserInRolesDto {
    /**
     * providerId
     */
    providerId: string;

    /**
     * policyId
     */
    policyId: string;

    /**
     * agentNumber
     */
    agentNumber: string;

    /**
     * roleByBupaInsurance: RoleByBupaInsuranceDto
     */
    roleByBupaInsurance: RoleByBupaInsuranceDto;
}
