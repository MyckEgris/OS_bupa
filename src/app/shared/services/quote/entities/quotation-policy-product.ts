/**
* QuotationPolicyProduct
*
* @description: This class contains policy product information for make a quotation request
* @author Juan Camilo Moreno
* @version 1.0
* @date 01-10-2019.
*
**/

import { QuotationPolicyProductPlan } from './quotation-policy-product-plan';

/**
 * This class contains policy product information for make a quotation request
 */
export interface QuotationPolicyProduct {
    /**
     * productId
     */
    productId: number;

    /**
     * productName
     */
    productName: string;

    /**
     * Array QuotationPolicyProductPlan
     */
    plans: Array<QuotationPolicyProductPlan>;
}
