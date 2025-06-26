/**
* ClaimSubmissionResponse.ts
*
* @description: claim submission response
* @author Yefry Lopez
* @version 1.0
* @date 28-11-2018.
*
**/

import { ClaimSubmissionModel } from './ClaimSubmissionModel';

/**
 * claim submission response
 */
export interface ClaimSubmissionResponse {


  /**
   * count
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
   * ClaimSubmissionModel
   */
  data: ClaimSubmissionModel[];
}
