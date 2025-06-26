/**
* Provider.ts
*
* @description: Model provider
* @author Juan Camilo Moreno
* @version 1.0
* @date 10-10-2018.
*
**/

/**
 * Model provider
 */
export interface Provider {

    /**
     * name
     */
    name: string;

    /**
     * webSite
     */
    webSite: string;

    /**
     * language
     */
    language: string;

    /**
     * country
     */
    country: string;

    /**
     * address1
     */
    address1: string;

    /**
     * address2
     */
    address2: string;

    /**
     * phone1
     */
    phone1: string;

    /**
     * phone2
     */
    phone2: string;

    /**
     * paymentMethod
     */
    paymentMethod: string;

    /**
     * taxNumber
     */
    taxNumber: number;

    /**
     * accountName
     */
    accountName: string;

    /**
     * accountTitle
     */
    accountTitle: string;

    /**
     * accountPhone
     */
    accountPhone: string;

    /**
     * accountEmail
     */
    accountEmail: string;
}
