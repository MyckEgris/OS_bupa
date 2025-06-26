
/***
 * PatientModel
 */
export interface PatientModel {
    dob: Date;
    fullName: string;
    firstName: string;
    lastName: string;
    memberId: string;
    policyId: string;
    isGroupPolicy: number;
    country: string;
}
