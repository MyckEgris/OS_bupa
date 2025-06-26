/**
* ClaimSubmissionRequest.ts
*
* @description: DTO claim submission
* @author Yefry Lopez
* @version 1.0
* @date 10-10-2018.
*
**/

import { ClaimSubmissionModel } from './ClaimSubmissionModel';

/**
 * DTO claim submission
 */
export interface ClaimSubmissionRequest {

  /**
   * ClaimSubmissionModel
   */
  claim: ClaimSubmissionModel;
}
