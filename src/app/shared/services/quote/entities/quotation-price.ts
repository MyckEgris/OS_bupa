/**
* QuotationPrice
*
* @description: This class contains PRICE information for make a quotation request
* @author Juan Camilo Moreno
* @version 1.0
* @date 01-10-2019.
*
**/
import { QuotationPriceDetail } from './quotation-price-detail';
import { QuotationPriceMember } from './quotation-price-member';

/**
 * This class contains PRICE information for make a quotation request
 */
export interface QuotationPrice {
    /**
     * quotationPriceId
     */
    quotationPriceId: string;

    /**
     * modeOfPayment
     */
    modeOfPayment: number;

    /**
     * premium
     */
    premium: number;

    /**
     * Array QuotationPriceDetail
     */
    quotationPriceDetails: Array<QuotationPriceDetail>;

    /**
     * Array QuotationPriceMember
     */
    memberQuotationPrice: Array<QuotationPriceMember>;
}
