import { Address } from './address';
import { Phone } from './phone';
import { Identification } from './identification';
import { Email } from 'src/app/shared/services/policy-application/entities/email';
export interface Beneficiary {
    applicationBeneficiaryGuid: string;
    applicationGuid: string;
    middleName: string;
    firstName: string;
    lastName: string;
    paternalLastName: string;
    maternalLastName: string;
    dob: Date;
    addresses: Array<Address>;
    phones: Array<Phone>;
    identifications: Array<Identification>;
    emails?: Array<Email>;
    relationOwner?: string;
}
