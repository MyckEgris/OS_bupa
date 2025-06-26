/**
* ClaimSubmissionRequest.ts
*
* @description: DTO claim submission status
* @author Yefry Lopez
* @version 1.0
* @date 10-10-2018.
*
**/

/**
 * DTO claim submission status
 */
export interface ClaimSubmissionStatus {

  /**
   * claimSubmissionStatusGUID
   */
  claimSubmissionStatusGUID: string;

  /**
   * claimSubmissionGUID
   */
  claimSubmissionGUID: string;

  /**
   * statusId
   */
  statusId: number;

  /**
   * updatedOn
   */
  updatedOn: Date | string;

  /**
   * updatedBy
   */
  updatedBy: string;

  /**
   * detail
   */
  detail: string;
}
