/***
 * Contact of whom the service is being requested
 */
export interface Contact {
    contactAuthId: number;
    contactName: string;
    contactPhone: string ;
    contactRelationship: string;
    contactPhoneInCountry: string;
    contactPhoneOutCountry: string;
    contactEmail: string;
    contactMethodId: number;
    contactTypeId: number;
}
