/**
* QuoteModeOfPaymentResponse
*
* @description: This class contains mode of payment response information
* @author Juan Camilo Moreno
* @version 1.0
* @date 01-10-2019.
*
**/

/**
 * This class contains mode of payment response information
 */
export interface QuoteModeOfPaymentResponse {
    /**
     * Selected
     */
    selected: boolean;

    /**
     * Id
     */
    id: number;

    /**
     * Name
     */
    name: string;

    /**
     * First payment label
     */
    firstPaymentLabel: string;

    /**
     * First payment price
     */
    firstPaymentPrice: number;

    /**
     * Aditional payments label
     */
    adicionalPaymentsLabel: string;

    /**
     * Count payments
     */
    countPayments: number;

    /**
     * Aditional payments price
     */
    adicionalPaymentsPrice: number;

    /**
     * Total price
     */
    totalPrice: number;
}
