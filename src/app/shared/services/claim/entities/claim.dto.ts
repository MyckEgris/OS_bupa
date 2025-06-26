/**
* ClaimDto.ts
*
* @description: DTO claims
* @author Juan Camilo Moreno.
* @version 1.0
* @date 10-10-2018.
*
**/

import { Claim } from './claims';

/**
 * DTO claims
 */
export interface ClaimDto {

    /**
     * Count
     */
    count: number;

    /**
     * pageIndex
     */
    pageIndex: number;

    /**
     * pageSize
     */
    pageSize: number;

    /**
     * data: Claim[]
     */
    data: Claim[];
}
