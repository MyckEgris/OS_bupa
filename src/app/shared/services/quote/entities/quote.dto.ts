/**
* QuoteDto
*
* @description: This class contains all information for make a quotation request
* @author Juan Camilo Moreno
* @version 1.0
* @date 01-10-2019.
*
**/
import { QuoteCustomer } from './quote-customer';
import { QuotationPolicy } from './quotation-policy';
import { QuotationMember } from './quotation-member';
import { QuotationPolicyDiscount } from './quotation-policy-discount';
import { QuotationPolicyProduct } from './quotation-policy-product';
import { QuotationPolicyPremium } from './quotation-policy-premium';
import { QuoteMode } from './quote-mode.enum';
import { QuotationModeOfPayment } from './quotation-mode-of-payment';

/**
 * This class contains all information for make a quotation request
 */
export interface QuoteDto {
    /**
     * Quote id
     */
    quoteId?: string;

    /**
     * Quote type
     */
    quoteType: number;

    /**
     * Quote Mode
     */
    quoteMode?: QuoteMode;

    /**
     * countryId
     */
    countryId?: number;

    /**
     * countryName
     */
    countryName?: string;

    /**
     * cityId
     */
    cityId?: number;

    /**
     * cityName
     */
    cityName?: string;

    /**
     * countryIsoAlpha
     */
    countryIsoAlpha?: string;

    /**
     * effectiveDate
     */
    effectiveDate?: Date;

    /**
     * modeOfPayment
     */
    modeOfPayment?: number;

    /**
     * currencyCode
     */
    currencyCode?: string;

    /**
     * currencyId
     */
    currencyId?: number;

    /**
     * Exchange rate
     */
    exchangeRate?: number;

    /**
     * Language Id.
     */
    languageId?: number;

    /**
     * QuoteCustomer
     */
    customer?: QuoteCustomer;

    /**
     * QuotationPolicy
     */
    policy?: QuotationPolicy;

    /**
     * QuotationDiscounts
     */
    discounts?: Array<QuotationPolicyDiscount>;

    /**
     * QuotationProduct
     */
    products?: Array<QuotationPolicyProduct>;

    /**
     * QuotationMember
     */
    members?: Array<QuotationMember>;

    /**
     * premiums
     */
    premiums?: Array<QuotationPolicyPremium>;

    /**
     * Mode of payments
     */
    modeOfPayments?: Array<QuotationModeOfPayment>;

    

}
