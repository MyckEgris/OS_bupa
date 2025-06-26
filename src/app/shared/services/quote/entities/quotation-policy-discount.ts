/**
* QuoteDto
*
* @description: This class contains discount information for make a quotation request
* @author Juan Camilo Moreno
* @version 1.0
* @date 01-10-2019.
*
**/

/**
 * This class contains discount information for make a quotation request
 */
export interface QuotationPolicyDiscount {

    /**
     * discountCategoryId
     */
    // discountCategoryId?: number;

    /**
     * discountType
     */
    discountType: string;

    /**
     * discountValue
     */
    value: number;
}
