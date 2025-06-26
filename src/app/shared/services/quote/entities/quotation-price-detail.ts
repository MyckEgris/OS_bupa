/**
* QuotationPriceDetail
*
* @description: This class contains price detail information for make a quotation request
* @author Juan Camilo Moreno
* @version 1.0
* @date 01-10-2019.
*
**/

/**
 * This class contains price detail information for make a quotation request
 */
export interface QuotationPriceDetail {
    /**
     * Type
     */
    type: number;

    /**
     * Subtype
     */
    subType: number;

    /**
     * Price
     */
    price: number;
}
