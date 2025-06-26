/**
* Common.ts
*
* @description: Contract for common service.
* @author Juan Camilo Moreno.
* @version 1.0
* @date 17-09-2018.
*
**/

import { FileDocument } from '../services/common/entities/fileDocument';

/**
 * Contract for common service
 */
export interface Common {

    /**
     * Get a bupa registered country by id
     * @param id Country ID
     */
    getCountryById(id: number);

    /**
     * Get a bupa registered language by id
     * @param id Language ID
     */
    getLanguageById(id: number);

    /**
     * Upload file for Claim Submission Step 2
     * @param document  file selected in step 2
     */
    uploadFirstDocument(document: FileDocument);

    /**
     * Upload Document To Folder.
     * @param file File selected to Upload in claim submission.
     * @param folder folder that contain the file selected.
     */
    uploadDocumentToFolder(file: FileDocument, folder: string);

    /**
     * Delete folder , It was create in claim submission
     * @param folder folder to delete.
     */
    deleteFolder(folder: string);

    /**
     * Obtain Country by Isoalpha
     * @param isoalpha
     */
    getCountryByIsoalpha(isoalpha: string);
}
