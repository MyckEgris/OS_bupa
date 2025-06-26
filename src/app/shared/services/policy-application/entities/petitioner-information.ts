import { Company } from './company';
import { Address } from './address';
import { Phone } from './phone';
import { Email } from './email';
import { Identification } from './identification';
import { Person } from './person';

export interface PetitionerInformation {
    applicationPetitionerGuid: string;
    applicationGuid: string;
    petitionerTypeId: number;
    industryId?: number;
    sourceOfFundingId?: number;
    otherSourceOfFounding: string;
    company?: Company;
    person?: Person;
    petitionerType: string;
    industry: string;
    sourceOfFunding: string;
    addresses: Array<Address>;
    phones: Array<Phone>;
    emails: Array<Email>;
    identifications: Array<Identification>;
}
