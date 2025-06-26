import { Country } from '../../../common/entities/country';

/***
 * Member for whom the service is being requested
 */
export interface PatientDto {
    memberId: number;
    policyId: number;
    fullName: string;
    firstName: string;
    lastName: string;
    dob: string;
    isGroupPolicy: number;
    country: Country;
}
