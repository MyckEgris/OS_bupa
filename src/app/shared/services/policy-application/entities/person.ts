import { PetitionerExtension } from './petitioner-extension';

export interface Person {
    applicationPersonPetitionerGuid: string;
    applicationPetitionerGuid: string;
    firstName: string;
    middleName: string;
    paternalLastName: string;
    maternalLastName: string;
    lastName: string;
    dob: Date;
    genderId: number;
    patrimonialLinks: string;
    nationalityId: number;
    countryOfBirthId: number;
    petitionerExtension?: PetitionerExtension;
}
