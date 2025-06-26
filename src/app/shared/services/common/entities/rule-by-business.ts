import { DocumentType } from './document-type.interface';
import { RuleDocument } from './rule-document.interface';
export interface RuleByBusiness {
    applicationRulesGuid: string;
    applicationGuid: string;
    rulesByBusinessId: number;
    answer: boolean;
    ruleName: string;
    ruleDescription: string;
    isRequired: boolean;
    order: number;
    ruleDocumentId: number;
    ruleDocument: RuleDocument;
    documentTypeId: number;
    documentType: DocumentType;

}

