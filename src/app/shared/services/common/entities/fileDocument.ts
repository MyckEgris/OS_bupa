/**
* FileDocument.ts
*
* @description: Model file document
* @author Yefry Lopez
* @version 1.0
* @date 10-10-2018.
*
**/

import { loadingStatus } from './loadingStatus';

/**
 * Model file document
 */
export class FileDocument {

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
   * documentType
   */
  documentType?: string;

}
