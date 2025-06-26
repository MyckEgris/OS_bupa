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
export interface ClaimSubmissionSender {
  /**
   * Sender full name
   */
  senderFullName: string;

  /**
   * Sender Email Address
   */
  senderEmailAddress: string;

  /**
   * Sender CC Email Address
   */
  // senderEmailCCAddress: string;

  /**
   * Sender TypeId
   */
  senderTypeId: number;
}
