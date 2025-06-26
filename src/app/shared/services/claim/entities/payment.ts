/**
* Payment.ts
*
* @description: Model payment
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

/**
 * Model payment
 */
export interface Payment {

    /**
     * paymentMethod
     */
    paymentMethod: string;

    /**
     * method
     */
    method: string;

    /**
     * paymentNumber
     */
    paymentNumber: number;

    /**
     * amount
     */
    amount: number;

    /**
     * providerPaidAmount
     */
    providerPaidAmount: number;

    /**
     * isProvider
     */
    isProvider: boolean;

    /**
     * isThirdParty
     */
    isThirdParty: boolean;

    /**
     * statusId
     */
    statusId: number;

    /**
     * paymentDate
     */
    paymentDate: string;

    /**
     * paymentDateToShow
     */
    paymentDateToShow: string;

    /**
     * billingProviderName
     */
    billingProviderName: string;
}
