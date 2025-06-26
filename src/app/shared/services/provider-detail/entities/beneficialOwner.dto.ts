/**
* BeneficialOwnerDto.ts
*
* @description: DTO beneficial owner.
* @author Jose Daniel Hernandez M.
* @version 1.0
* @date 19-07-2020.
*
*/


import { Country } from 'src/app/shared/services/common/entities/country';


/**
 * DTO beneficial owner.
 */
export interface BeneficialOwnerDto {

    /**
     * beneficialOwnerKey
     */
    beneficialOwnerKey: string;

    /**
     * firstName
     */
    firstName: string;

    /**
     * secondName
     */
    secondName: string;

    /**
     * FirstSurname
     */
    firstSurname: string;

    /**
     * SecondSurname
     */
    secondSurname: string;

    /**
     * DateOfBirth
     */
    dateOfBirth: string;

    /**
     * NationalityCountryKey
     */
    nacionalityCountryKey: string;

    /**
     * Nationality
     */
    nacionality: Country;

    /**
     * CountryOfResidenceKey
     */
    countryOfResidenceKey: string;

    /**
     * CountryOfResidence
     */
    countryOfResidence: Country;

    /**
     * OwnershipSharePercentage
     */
    ownershipSharePercentage: string;

}
