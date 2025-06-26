/**
* NetworkResponseDto.ts
*
* @description: DTO Network Response
* @author Jose Daniel Hernández M.
* @version 1.0
* @date 04-02-2020.
*
**/

import { CoverageByPlanKeyDto } from './coverageByPlanKey.dto';

/**
 * DTO NetworkResponse
 */
export interface CoverageResponseDto {

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
     * data: CoveragesByPlanKeyDto[]
     */
    data: CoverageByPlanKeyDto[];

  }
