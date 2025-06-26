/**
* QuotationWizard
*
* @description: This class has calculator values to show
* @author Juan Camilo Moreno
* @version 1.0
* @date 01-10-2019.
*
**/

/**
 * This class has calculator values to show
 */
export interface QuoteSummaryPremium {

    /**
     * Cost
     */
    cost: number;

    /**
     * Cost detailed
     */
    costs: Array<any>;

    /**
     * Discount
     */
    discount: number;

    /**
     * Discount percentage
     */
    discountPerc: number;

    /**
     * Subtotal
     */
    subtotal: number;

    /**
     * Rider
     */
    riderTotal: number;

    /**
     * Riders detailed
     */
    riders: Array<any>;

    /**
     * Fees
     */
    feeTotal: number;

    /**
     * Fees detailed
     */
    fees: Array<any>;

    /**
     * Taxes
     */
    taxTotal: number;

    /**
     * Taxes detailed
     */
    taxes: Array<any>;

    /**
     * Total
     */
    total: number;

    /**
     * Currency code
     */
    currency: string;
}
