import { ApplicationDocument } from './application-document';
/**
* PolicyApplicationDocumentSubmit.ts
*
* @description: DTO policy application documents
* @author Juan Camilo Moreno
* @version 1.0
* @date 14-01-2019.
*
**/

/**
 * DTO policy application documents
 */
export interface PolicyApplicationDocumentSubmit {

  /**
   * folderName
   */
  folderName: string;

  /**
   * documents
   */
  documents: ApplicationDocument[];
}
