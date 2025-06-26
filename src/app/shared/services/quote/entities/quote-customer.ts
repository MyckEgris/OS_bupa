/**
* QuoteCustomer
*
* @description: This class contains customer information for make a quotation request
* @author Juan Camilo Moreno
* @version 1.0
* @date 01-10-2019.
*
**/
import { QuoteInsuranceBussines } from './quote-insuranceBussines';
import { QuoteContact } from './quote-contact';
import { QuoteAccountType } from './quote-account-type';

/**
 * This class contains customer information for make a quotation request
 */
export interface QuoteCustomer {
    /**
     * Customer id
     */
    customerId: string;

    /**
     * Fullname
     */
    fullName: string;

    /**
     * Insurance business object
     */
    bupaInsurance: QuoteInsuranceBussines;

    /**
     * QuoteContact
     */
    contact: QuoteContact;

    /**
     * QuoteAccountType
     */
    accountType: QuoteAccountType;
}
