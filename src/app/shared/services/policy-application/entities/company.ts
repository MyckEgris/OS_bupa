import { CompanyContacts } from './company-contacts';
import { PetitionerExtension } from './petitioner-extension';

export interface Company {
    applicationCompanyPetitionerGuid: string;
    applicationPetitionerGuid: string;
    companyName: string;
    constitution: Date;
    commercialNumber: string;
    nationalityId: number;
    companyContacts: Array<CompanyContacts>;
    isContractor: string;
    petitionerExtension?: PetitionerExtension;
}
