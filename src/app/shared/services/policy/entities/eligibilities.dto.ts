
/**
* EligibilitiesDto.ts
*
* @description: DTO Eligibilities
* @author Jose Daniel Hernández.
* @version 1.0
* @date 13-09-2019.
*
**/

/**
 * DTO EligibilitiesDto
 */
export interface EligibilitiesDto {

    /**
     * eligibilityId: number
     */
    eligibilityId: number;

    /**
     * planId: number
     */
    planId: number;

    /**
     * description: string
     */
    description: string;

    /**
     * eligibilityFromDate: string
     */
    eligibilityFromDate: string;

    /**
     * eligibilityToDate: string
     */
    eligibilityToDate: string;

    /**
     * currencyId: number
     */
    currencyId: number;

    /**
     * currencySymbol: string
     */
    currencySymbol: string;

    /**
     * currencyCode: string
     */
    currencyCode: string;

}
