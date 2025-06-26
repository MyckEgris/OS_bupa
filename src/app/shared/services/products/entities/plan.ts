/**
 * Plan.ts
 * @description Plan data transfer object.
 * @author Ivan Alejandro Hidalgo
 * @version 1.0
 * @date 13-03-2020.
 **/

/**
 * Plan Model
 */
export class Plan {
    /**
     * product id
     */
    planId: number;

    /**
     * product name
     */
    planName: string;

    planNameToShow: string;

    englishPlanName: string;

    spanishPlanName: string;

    planDescription: string;

    deductibleId: number;

    benefitCurrencyCode: string;

    deductibleInCountry: number;

    deductibleOutCountry: number;


}
