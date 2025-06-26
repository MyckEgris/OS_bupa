import { PolicyChangesByLanguageDto } from './policy-changes-by-language.dto';
import { PolicyChangesByDocumentsDto } from './policy-changes-by-documents.dto';
import { PolicyChangesByMessageDto } from './policy-changes-by-message.dto';

export interface PolicyChangesDto {
    processOptionId: number;
    processId: number;
    roleId: number;
    insuranceBusinessId: number;
    processOptionName: string;
    descriptionByLanguage: PolicyChangesByLanguageDto[];
    documents: PolicyChangesByDocumentsDto[];
    message: PolicyChangesByMessageDto[];

    /***
     * Field to display
     */
    description: string;

    /***
     * Field to display
     */
    messageLanguage: string;

    /***
     * Field to display
     */
    documentsLanguage: PolicyChangesByDocumentsDto[];
}
