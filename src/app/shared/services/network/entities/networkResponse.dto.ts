/**
* NetworkResponseDto.ts
*
* @description: DTO Network Response
* @author Jose Daniel Hernández M.
* @version 1.0
* @date 04-02-2020.
*
**/

import { NetworksByProductKeyDto } from './networksByProductKey.dto';

/**
 * DTO NetworkResponse
 */
export interface NetworkResponseDto {

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
     * data: NetworksByProductKeyDto[]
     */
    data: NetworksByProductKeyDto[];
}
