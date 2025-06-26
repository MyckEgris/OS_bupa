import { Email } from './email';
import { Address } from './address';
import { Phone } from './phone';
import { Rule } from './rule';
import { HistoryLog } from './history-log';
import { Company } from './company';

export interface Petitioner {
    applicationPetitionerGuid: string;
    applicationGuid: string;
    petitionerTypeId: number;
    firstName: string;
    middleInitial: string;
    lastName: string;
    dob: Date;
    genderId: number;
    companyName: string;
    constitution: Date;
    commercialNumber: string;
    legalRepresentative: string;
    businessType: string;
    languageId: number;
    language: string;
    petitionerType: string;
    addresses: Array<Address>;
    phones: Array<Phone>;
    emails: Array<Email>;
    rules: Array<Rule>;
    historyLogs: Array<HistoryLog>;

    company: Company;
}
