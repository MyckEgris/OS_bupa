/**
* ExcludedNetworksResponseDto.ts
*
* @description: DTO Excluded Network Response
* @author Jose Daniel Hernández M.
* @version 1.0
* @date 06-02-2020.
*
**/

import { NetworkDto } from './network.dto';

/**
 * DTO ExcludedNetworksResponse
 */
export interface ExcludedNetworksResponseDto {

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
     * data: NetworkDto[]
     */
    data: NetworkDto[];
}
