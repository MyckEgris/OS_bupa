/**
* ClaimSubmissionDocument.ts
*
* @description: Model claim submission document
* @author Yefry Lopez
* @version 1.0
* @date 10-10-2018.
*
**/

/**
 * Model claim submission document
 */
export interface ClaimSubmissionDocument {

  /**
   * claimSubmissionDocumentGUID
   */
  claimSubmissionDocumentGUID: string;

  /**
   * claimSubmissionGUID
   */
  claimSubmissionGUID: string;

  /**
   * documentName
   */
  documentName: string;

  /**
   * documentTypeId
   */
  documentTypeId: number;

  /**
   * documentTypeName
   */
  documentTypeName: string;

}

