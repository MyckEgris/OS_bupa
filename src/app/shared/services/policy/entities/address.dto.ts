/**
* AddreestDto.ts
*
* @description: DTO policy member
* @author Andres Tamayo
* @date 11-02-2019.
*
**/
export interface AddressOutputDto {
    addressTypeId: number;
    type: string;
    addressLine: string;
    city: string;
    cityId: number;
    zipCode: string;
    state: string;
    countryId: number;
    country: string;
    isoAlpha: string;
    fromDate?: Date;
    toDate?: Date;

    colonyId: number;
    exterior: string;
    interior: string;
    localityId: number;
    municipality: string;
    street: string;

    colony: string;
}
