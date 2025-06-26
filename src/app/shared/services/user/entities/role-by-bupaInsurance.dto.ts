/**
* RoleByBupaInsuranceDto.ts
*
* @description: DTO role by bupa insurance
* @author Juan Camilo Moreno
* @version 1.0
* @date 17-09-2018.
*
**/

import { RoleDto } from './role.dto';
import { BupaInsuranceDto } from './bupaInsurance.dto';

/**
 * DTO role by bupa insurance
 */
export interface RoleByBupaInsuranceDto {
    /**
     * role: RoleDto
     */
    role: RoleDto;

    /**
     * bupaInsurance: BupaInsuranceDto
     */
    bupaInsurance: BupaInsuranceDto;
}
