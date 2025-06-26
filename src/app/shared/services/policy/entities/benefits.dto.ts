import { AccumulatorBenefitDto } from './accumulatorBenefit.dto';
import { BenefitScopesDto } from './benefitScopes.dto';

/**
* BenefitsDto.ts
*
* @description: DTO Benefits
* @author Jose Daniel Hernández.
* @version 1.0
* @date 13-09-2019.
*
**/

/**
 * DTO BenefitsDto
 */
export interface BenefitsDto {

    /**
     * policyId: number
     */
    policyId: number;

    /**
     * memberId: number
     */
    memberId: number;

    /**
     * groupBenefitType: number
     */
    groupBenefitType: number;

    /**
     * benefitType: string
     */
    benefitType: string;

    /**
     * accumulatorDefinitionId: number
     */
    accumulatorDefinitionId: number;

    /**
     * accumulatorDescription: string
     */
    accumulatorDescription: string;

    /**
     * benefitScopes: BenefitScopesDto[]
     */
    benefitScopes: BenefitScopesDto[];

    /**
     * accumulatorBenefitByLanguage: AccumulatorBenefitDto[]
     */
    accumulatorBenefitByLanguage: AccumulatorBenefitDto[];

}
