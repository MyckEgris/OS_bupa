/**
* QuotationMemberExtrapremium
*
* @description: This class contains member extrapermium information for make a quotation request
* @author Juan Camilo Moreno
* @version 1.0
* @date 01-10-2019.
*
**/

/**
 * This class contains member extrapermium information for make a quotation request
 */
export interface QuotationMemberExtrapremium {

    /**
     * extraPremiumTypeId
     */
    extraPremiumId: number;

    /**
     * extraPremiumType
     */
    extraPremiumType: number;

    /**
     * extraPremiumValue
     */
    extraPremiumValue: number;

    /**
     * quantity
     */
    quantity: number;
}
