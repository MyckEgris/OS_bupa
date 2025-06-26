/**
* QuotationPolicyProductPlanDeductible
*
* @description: This class contains policy product information for make a quotation request
* @author Juan Camilo Moreno
* @version 1.0
* @date 01-10-2019.
*
**/

/**
 * This class contains policy product information for make a quotation request
 */
export interface QuotationPolicyProductPlanDeductible {
    /**
     * deductibleId
     */
    deductibleId: number;

    /**
     * globalDeductiblePremium
     */
    globalDeductiblePremium: number;

    /**
     * localDeductiblePremium
     */
    localDeductiblePremium: number;
}
