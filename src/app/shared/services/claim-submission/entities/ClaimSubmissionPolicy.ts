/**
* ClaimSubmissionRequest.ts
*
* @description: DTO claim submission policy
* @author Yefry Lopez
* @version 1.0
* @date 10-10-2018.
*
**/

/**
 * DTO claim submission policy
 */
export interface ClaimSubmissionPolicy {

  /**
   * policyId
   */
  policyId: number;

  /**
   * policyCountry
   */
  policyCountry: string;

  /**
   * isGroupPolicy
   */
  isGroupPolicy: boolean;

  /**
   * insuranceBusinessId
   */
  insuranceBusinessId: number;

  /**
   * insuranceBusinessName
   */
  insuranceBusinessName: string;

  /**
   * groupId?
   */
  groupId?: number;

}
