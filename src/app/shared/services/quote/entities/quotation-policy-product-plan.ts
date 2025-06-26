/**
* QuotationPolicyProductPlan
*
* @description: This class contains policy product plan information for make a quotation request
* @author Juan Camilo Moreno
* @version 1.0
* @date 01-10-2019.
*
**/

import { QuotationPolicyProductPlanDeductible } from './quotation-policy-product-plan-deductible';
import { QuotationPolicyProductPlanRider } from './quotation-policy-product-plan-rider';

/**
 * This class contains policy product plan information for make a quotation request
 */
export interface QuotationPolicyProductPlan {
    /**
     * planId
     */
    planId: number;

    /**
     * planName
     */
    planName: string;

    /**
     * planDescription
     */
    planDescription: string;

    /**
     * Maximum coverage.
     */
    limitValue?: number;

    /**
     * deductibleId
     */
    deductibleId: number;

    /**
     * Deductible in Country.
     */
    deductibleInCountry?: number;

    /**
     * Deductible out Country.
     */
    deductibleOutCountry?: number;

    /**
     * Array QuotationPolicyProductPlanRider
     */
    riders: Array<QuotationPolicyProductPlanRider>;

    currentPlan?: boolean;
}
