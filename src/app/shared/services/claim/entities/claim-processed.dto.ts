/**
* ClaimProcessedDto.ts
*
* @description: DTO processed claims
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

import { Claim } from './claims';

/**
 * DTO processed claims
 */
export interface ClaimProcessedDto {

    /**
     * Count result
     */
    searchCount: number;

    /**
     * Current page index
     */
    page: number;

    /**
     * Page size
     */
    pageSize: number;

    /**
     * Array of claims - claims: Claim[]
     */
    claims: Claim[];
}
