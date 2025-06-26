import { QuotationPolicyProduct } from "./quotation-policy-product";

/**
* QuotationPolicy
*
* @description: This class contains policy detail information for make a quotation request
* @author Juan Camilo Moreno
* @version 1.0
* @date 01-10-2019.
*
**/

/**
 * This class contains policy detail information for make a quotation request
 */
export interface QuotationPolicy {

    /**
     * 
     */
    policyReferenceId: string;

    /**
     * policy id
     */
    policyId: number;

    /**
     * policy type
     */
    policyTypeId: number;

    /**
     * policy status
     */
    policyStatus: string;

      /**
     * policy Issue Date
     */
    policyIssueDate?: Date;



}
