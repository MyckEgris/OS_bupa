/**
* QuotationWizard
*
* @description: This class id the wizard object for get and set data between steps of quotation process
* @author Juan Camilo Moreno
* @version 1.0
* @date 01-10-2019.
*
**/
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { QuoteDto } from 'src/app/shared/services/quote/entities/quote.dto';

/**
 * This class id the wizard object for get and set data between steps of quotation process
 */
export interface QuotationWizard {
    /**
     * Policy Id
     */
    policyId: any;

    /**
     * Current step
     */
    currentStep: number;

    /**
     * Language Id
     */
    languageId: number;

    /**
     * Policy detail
     */
    policyDetail: PolicyDto;

    /**
     * Benefits
     */
    benefits: any;

    /**
     * Current plan
     */
    currentPlan: number;

    /**
     * Quotation policy object
     */
    quotationPolicy: QuoteDto;

    /**
     * Products
     */
    products?: any;

    /**
     * Payment
     */
    paymentMethods?: any;

    addedMembers?: Array<any>;
}
