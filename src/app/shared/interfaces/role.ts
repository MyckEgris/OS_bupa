/**
* Role.ts
*
* @description: Contract for role service.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 17-09-2018.
*
**/

/**
 * Contract for role service.
 */
export interface Role {

    /**
     * Get role options by role and bupa insurance id
     * @param roleId Role id
     * @param idBupaInsurance Bupa insurance id
     */
    GetRoleOptionsByRoleIdAndBupaInsurance(roleId: string, idBupaInsurance: string);
}
