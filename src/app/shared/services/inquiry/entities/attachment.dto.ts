/***
 * Information of documents of information request
 */
export interface AttachmentDto {
    fileName: string;
    aliasFileName: string;
    uri: string;
    attachmentId?: string;
    inquiryId?: string;
    mimeType?: string;
    noteText?: string;
    createdOn?: Date;
    modifiedOn?: Date;
    fileSize?: number;
    documentbody?: any;
    subject?: string;
}
