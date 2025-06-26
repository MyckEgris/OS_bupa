import { ClaimSubmissionDocument } from './ClaimSubmissionDocument';

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
export interface ClaimSubmissionDocumentSubmit {

  /**
   * folderName
   */
  folderName: string;

  /**
   * documents
   */
  documents: ClaimSubmissionDocument[];
}
