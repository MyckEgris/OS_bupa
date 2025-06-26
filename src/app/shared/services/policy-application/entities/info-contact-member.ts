/***
 * Dependent contact information, is captured in the dependent section of the policy application
 */
export interface InfoContactMember {
    email: string;
    countryId: number;
    cityId: number;
    codeArea: number;
    phone: string;
    extension?: string;
}
