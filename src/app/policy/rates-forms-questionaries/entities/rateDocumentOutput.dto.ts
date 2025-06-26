
/**
* document
*
* @description: RateDocument Interface.
* @author Andrés Tamayo
* @version 1.0
* @date 13-06-2019.
*
**/

export interface RateDocumentOutput {
    /**
     * content
     */
    content: string;
    /**
     * document ID
     */
    documentId: string;
    /**
     * document language
     */
    documentLanguage: number;
    /**
     * document name
     */
    documentName: string;
    /**
     * document path
     */
    documentPath: string;
    /**
     * document source
     */
    documentSource: string;
    /**
     * extension
     */
    extension: string;
    /**
     * file name
     */
    fileName: string;
    /**
     * folder name
     */
    folderName: string;
}
