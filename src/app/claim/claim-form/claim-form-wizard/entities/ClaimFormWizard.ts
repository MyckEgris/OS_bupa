/**
* ClaimSubmissionWizard.ts
*
* @description: DTO claim submission wizard
* @author Yefry Lopez
* @version 1.0
* @date 10-10-2018.
*
**/

import { UserInformationModel } from '../../../../security/model/user-information.model';
import { FormGroup } from '@angular/forms';
import { ClaimFormFileDocument } from './claimFormFileDocument';
import { ProviderOutputDto } from 'src/app/shared/services/provider/entities/provider.dto';
import { ClaimSubmissionMember } from 'src/app/shared/services/claim-submission/entities/ClaimSubmissionMember';
import { ClaimSubmissionModel } from 'src/app/shared/services/claim-submission/entities/ClaimSubmissionModel';
import { MemberOutputDto } from 'src/app/shared/services/policy/entities/member';
import { ClaimByMemberDto } from 'src/app/shared/services/claim/entities/claim-by-member.dto';
import { ClaimSubmissionPolicy } from 'src/app/shared/services/claim-submission/entities/ClaimSubmissionPolicy';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { ClaimFormQuestionary } from 'src/app/shared/services/claim-submission/entities/ClaimFormQuestionary';


/**
 * DTO claim submission wizard
 */
export interface ClaimFormWizard {

  /**
   * currentStep
   */
  currentStep: number;

  /**
   * member: MemberOutputDto
   */
  member: MemberOutputDto;

  /**
  * member: ClaimSubmissionMember
  */
  policyHolder: PolicyDto;

  /**
   * associatedProvider: ProviderOutputDto
   */
  associatedProvider: ProviderOutputDto;

  /**
   * documents: FileDocument[]
   */
  documents: ClaimFormFileDocument[];

  /**
   * folderName
   */
  folderName: string;

  /**
   * claimGuid
   */
  claimGuid: string;

  /**
   * statusGuid
   */
  statusGuid: string;

  /**
   * claimSubmission: ClaimSubmissionModel
   */
  claimSubmission: ClaimSubmissionModel;

  /**
   * user: UserInformationModel
   */
  user: UserInformationModel;

  /**
   * provider: ProviderOutputDto
   */
  provider: ProviderOutputDto;

  /**
   * searchForm: FormGroup
   */
  searchForm: FormGroup;

  /**
   * enrollmentForm: FormGroup
   */
  enrollmentForm: FormGroup;

  /**
   * memberSearchResult: MemberOutputDto[]
   */
  memberSearchResult: ClaimSubmissionMember[];

  /**
   * memberSearchResult: PolicyOutputDto[]
   */
  policySearchResult: PolicyDto[];

  /**
   * associatedProviderResult: ProviderOutputDto[];
   */
  associatedProviderResult: ProviderOutputDto[];

  /**
   * groupId?: number;
   */
  groupId?: number;

  /**
  * countryId?: number;
  */
  countryOfServiceId?: number;

  /**
  * countryId?: number;
  */
  currencyId?: number;

  /**
  * countryId?: number;
  */
  currencyCode?: string;

  /**
  * payeeId IdBank?: number;
  */
  bankInformationId?: number;
  /**
   * ClaimPaymentMethodId?: number;
   */
  claimPaymentMethoidId?: number;

  /**
  * ClaimPaymentMethodId?: number;
  */
  claimPaymentMethod?: string;

  /**
   * claimForm: questionary;
   */
  claimFormQuestionary: ClaimFormQuestionary[];

  /**
   * claimHeader
   */
  claimHeader?: number;

  /**
   * claimDate
   */
  claimDate?: string;

  /**
   * payDate
   */
  payDate?: string;

  /**
  * agreementAccepted
  */
  agreementAccepted: boolean;

  /**
   * policyContact: PolicyDto
   */
   policyContact?: Partial<PolicyDto>;

}
