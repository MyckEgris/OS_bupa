
import { BenefitsDto } from './benefits.dto';

/**
* BenefitsInputDto.ts
*
* @description: Input DTO search benefits by member
* @author Jose Daniel Hernández.
* @version 1.0
* @date 13-09-2019.
*
**/

/**
 * DTO BenefitsInputDto
 */
export interface BenefitsInputDto {

    /**
     * pageIndex: number
     */
    pageIndex: number;

    /**
     * pageSize: number
     */
    pageSize: number;

    /**
     * count: number
     */
    count: number;

    /**
     * data: BenefitsDto[]
     */
    data: BenefitsDto[];

}
