/**
* claimSubmissionFileDocument.ts
*
* @description: Model file document
* @author Yefry Lopez
* @version 1.0
* @date 10-10-2018.
*
**/

import { loadingStatus } from 'src/app/shared/services/common/entities/loadingStatus';


/**
 * Model Claim Submission File Document
 */
export class ClaimSubmissionFileDocument {

  /**
   * progress
   */
  progress: number;

  /**
   * loadingStatus: loadingStatus
   */
  loadingStatus: loadingStatus;

  /**
   * file: File
   */
  file: File;

  /**
   * icon
   */
  icon: string;

  /**
   * documentType Catergory
   */
  category: string;

}
