/**
* Policy.ts
*
* @description: Model policy
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

/**
 * Model policy
 */
export interface Policy {

    /**
     * policyId
     */
    policyId: number;

    /**
     * policyNumber
     */
    policyNumber: string;

    /**
     * policyReference
     */
    policyReference: string;

    /**
     * policyLegacyNumber
     */
    policyLegacyNumber: string;
}
