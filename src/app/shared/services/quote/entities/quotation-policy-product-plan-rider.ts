/**
* QuotationPolicyProductPlanRider
*
* @description: This class contains policy riders information for make a quotation request
* @author Juan Camilo Moreno
* @version 1.0
* @date 01-10-2019.
*
**/

/**
 * This class contains policy riders information for make a quotation request
 */
export interface QuotationPolicyProductPlanRider {
    /**
     * Rider id
     */
    riderId: number;

    /**
     * Name
     */
    name: string;

    /**
     * Cost
     */
    cost: number;

    /**
     * applyRiderId
     */
    applyRiderId: number;

    /**
     * fixedAmtOrPct
     */
    fixedAmtOrPct: any;
}
