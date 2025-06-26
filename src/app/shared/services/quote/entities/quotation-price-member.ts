/**
* QuotationPriceMember
*
* @description: This class contains price member information for make a quotation request
* @author Juan Camilo Moreno
* @version 1.0
* @date 01-10-2019.
*
**/
import { QuotationPriceDetail } from './quotation-price-detail';

/**
 * This class contains price member information for make a quotation request
 */
export interface QuotationPriceMember {
    /**
     * memberNumber
     */
    memberNumber: number;

    /**
     * quotationPriceDetails
     */
    quotationPriceDetails: Array<QuotationPriceDetail>;
}
