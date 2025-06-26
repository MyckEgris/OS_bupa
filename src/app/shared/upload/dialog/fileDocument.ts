import { loadingStatus } from '../../services/common/entities/loadingStatus';

/**
* FileDocument.ts
*
* @description: Model file document
* @author Ivan Hidalgo
* @version 1.0
* @date 10-10-2018.
*
**/

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
     * category
     */
    category: string;
}
