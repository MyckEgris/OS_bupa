

import { CoverageDto } from './coverage.dto';

/**
 * DTO ExcludedNetworksResponse
 */
export interface ExcludedCoverageResponseDto {

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
  data: CoverageDto[];
}
