import { Country } from './country';

/**
* Address.ts
*
* @description: Address Interface.
* @author Ivan Alejandro Hidalgo.
* @version 1.0
* @date 23-11-2018.
*
**/

export interface Address {
    addressLine: string;
    type: string;
    addressTypeId: number;
    city: string;
    state: string;
    zipCode: string;
    countryId: any;
    country: string;
    isoAlpha: string;
}
