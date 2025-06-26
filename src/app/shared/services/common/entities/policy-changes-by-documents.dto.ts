export interface PolicyChangesByDocumentsDto {
    documentPath: string;
    documentId: string;
    documentName: string;
    aliasDocumentName: string;
    rewriteFileName: boolean;
    documentFolder: string;
    documentLanguage: number;
    content: string;
    extension: string;
    documentMetadata: string;
    processOptionId: number;
}
