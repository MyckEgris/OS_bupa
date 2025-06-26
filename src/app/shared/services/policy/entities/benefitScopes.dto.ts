/**
* BenefitScopesDto.ts
*
* @description: DTO Benefit Scopes
* @author Jose Daniel Hernández.
* @version 1.0
* @date 13-09-2019.
*
**/

/**
 * DTO BenefitScopesDto
 */
export interface BenefitScopesDto {

    /**
     * scope: string
     */
    scope: string;

    /**
     * limitValue: number
     */
    limitValue: number;

    /**
     * usedValue: number
     */
    usedValue: number;

    /**
     * remainderValue: number
     */
    remainderValue: number;

    /**
     * diagnosticName: string
     */
    diagnosticName: string;

    /**
     * valueType: string
     */
    valueType: string;
}
