import { TransactionPetitionerDto } from './transaction-petitioner.dto';

export interface TransactionPolicyDto{
    policyId: number;
    policyReference: string;
    fixedRate: number;
    firstName: string;
    middleName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    petitioner: TransactionPetitionerDto;
}
