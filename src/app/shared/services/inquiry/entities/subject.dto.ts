import { SubjectsByLanguajeDto } from './subjects-by-languaje.dto';

/***
 * dto created for mapped the information of list of subject and subject type.
 * This subjects are used for create inquiry in CRM
 */
export interface SubjectDto {
    subjectId: string;
    isEnabled: boolean;
    orderPriority: string;
    subjectReference: string;
    subjectInformationSons: SubjectDto[];
    subjectsByLanguage: SubjectsByLanguajeDto[];
 }
