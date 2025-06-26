/**
* ProviderProfileDetailWizardDto.ts
*
* @description: DTO provider detail profile wizard.
* @author Jose Daniel Hernandez M.
* @version 1.0
* @date 19-07-2020.
*
*/


import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { FormGroup } from '@angular/forms';
import { ProviderProfileDetailDto } from 'src/app/shared/services/provider-detail/entities/providerProfileDetail.dto';
import { Country } from 'src/app/shared/services/common/entities/country';
import { State } from 'src/app/shared/services/common/entities/state';
import { City } from 'src/app/shared/services/common/entities/city';
import { PrincipalLanguageDto } from 'src/app/shared/services/provider-detail/entities/principalLanguage.dto';
import { DocumentTypeDto } from 'src/app/shared/services/provider-detail/entities/documentType.dto';
import { BeneficialOwnerTempDto } from './beneficialOwnerTemp.dto';




/**
 * DTO provider detail profile wizard.
 */
export interface ProviderProfileDetailWizardDto {

  /**
   * user
   */
  user: UserInformationModel;

  /**
   * providerProfileDetail
   */
  providerProfileDetailInfo: ProviderProfileDetailDto;

  /**
   * currentStep
   */
  currentStep: number;

  /**
   * providerProfileForm
   */
  providerProfileForm: FormGroup;

  /**
   * benefitialOwnerList
   */
  benefitialOwnerList: BeneficialOwnerTempDto[];

  /**
   * countries
   */
  countries: Country[];

  /**
   * cities
   */
  cities: City[];

  /**
   * states
   */
  states: State[];

  /**
   * languages
   */
  languages: PrincipalLanguageDto[];

  /**
   * documentTypes
   */
  documentTypes: DocumentTypeDto[];

}
