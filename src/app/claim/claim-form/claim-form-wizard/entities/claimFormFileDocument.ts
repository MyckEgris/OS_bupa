/**
* ClaimSubmissionFileDocument.ts
*
* @description: Model file document
* @author Yefry Lopez
* @version 1.0
* @date 10-10-2018.
*
**/

import { FileEntity } from 'src/app/shared/services/common/entities/file-entity';
import { loadingStatus } from 'src/app/shared/services/common/entities/loadingStatus';


/**
 * Model Claim Submission File Document
 */
export class ClaimFormFileDocument {

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
  file: FileEntity;

  /**
   * icon
   */
  icon: string;

  /**
   * documentType Catergory
   */
  category: string;

}
