/**
 * Tax certificate data response
 */
export interface TaxCertificateDataResponse {
    firstName: string;
    paternalLastName: string;
    maternalLastName: string;
    companyName: string;
    commercialSociety: string;
    zipCode: string;
    addressLine: string;
    street: string;
    interior: string;
    exterior: string;
    rfc: string;
    town: string;
    isCompany: boolean;
    colony: string;
    municipality: string;
    federalEntity: string;
}