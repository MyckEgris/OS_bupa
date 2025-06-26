/**
* BeneficialOwnerTempDto.ts
*
* @description: DTO temporary beneficial owner.
* @author Jose Daniel Hernandez M.
* @version 1.0
* @date 19-07-2020.
*
*/

import { Country } from 'src/app/shared/services/common/entities/country';


/**
 * DTO temporary beneficial owner.
 */
export interface BeneficialOwnerTempDto {

  /**
   * beneficialOwnerKey
   */
  beneficialOwnerKey?: string;

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
   * Nationality
   */
  nacionality: Country;

  /**
   * CountryOfResidence
   */
  countryOfResidence: Country;

  /**
   * OwnershipSharePercentage
   */
  ownershipSharePercentage: string;

}
