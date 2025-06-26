/**
* ProviderProfileDetailDto.ts
*
* @description: DTO provider detail profile.
* @author Jose Daniel Hernandez M.
* @version 1.0
* @date 19-07-2020.
*
*/


import { PrincipalLanguageDto } from './principalLanguage.dto';
import { DocumentTypeDto } from './documentType.dto';
import { Country } from '../../common/entities/country';
import { City } from '../../common/entities/city';
import { State } from '../../common/entities/state';
import { BeneficialOwnerDto } from './beneficialOwner.dto';


/**
 * DTO provider detail profile.
 */
export interface ProviderProfileDetailDto {

  /**
   * providerKey
   */
  providerKey: string;

  /**
   * accountName
   */
  accountName: string;

  /**
   * aliasForCheck
   */
  aliasForCheck: string;

  /**
   * languageKey
   */
  languageKey: string;

  /**
   * principalLanguage
   */
  principalLanguage: PrincipalLanguageDto;

  /**
   * documentTypeKey
   */
  documentTypeKey: string;

  /**
   * documentType
   */
  documentType: DocumentTypeDto;

  /**
   * documentTaxId
   */
  documentTaxId: string;

  /**
   * parentProviderAccountId
   */
  parentProviderAccountId: string;

  /**
   * parentProviderAccount
   */
  parentProviderAccount?: ProviderProfileDetailDto;

  /**
   * countryKey
   */
  countryKey: string;

  /**
   * country
   */
  country: Country;

  /**
   * cityKey
   */
  cityKey: string;

  /**
   * city
   */
  city: City;

  /**
   *  StateKey
   */
  stateKey: string;

  /**
   * State
   */
  state: State;

  /**
   * phone
   */
  phone: string;

  /**
   * cellPhone
   */
  cellPhone: string;

  /**
   * email
   */
  email: string;

  /**
   * webSiteUrl
   */
  webSiteUrl: string;

  /**
   * beneficialOwners
   */
  beneficialOwners: BeneficialOwnerDto[];

}
