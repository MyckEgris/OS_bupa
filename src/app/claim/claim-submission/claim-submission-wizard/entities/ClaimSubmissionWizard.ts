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
import { ClaimSubmissionFileDocument } from './ClaimSubmissionFileDocument';
import { ProviderOutputDto } from 'src/app/shared/services/provider/entities/provider.dto';
import { ClaimSubmissionMember } from 'src/app/shared/services/claim-submission/entities/ClaimSubmissionMember';
import { ClaimSubmissionModel } from 'src/app/shared/services/claim-submission/entities/ClaimSubmissionModel';
import { MemberOutputDto } from 'src/app/shared/services/policy/entities/member';
import { ClaimByMemberDto } from 'src/app/shared/services/claim/entities/claim-by-member.dto';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';


/**
 * DTO claim submission wizard
 */
export interface ClaimSubmissionWizard {

  /**
   * currentStep
   */
  currentStep: number;

  /**
   * currentSubStep
   */
  currentSubStep: string;

  /**
   * member: ClaimSubmissionMember
   */
  member: ClaimSubmissionMember;

  /**
   * associatedProvider: ProviderOutputDto
   */
  associatedProvider: ProviderOutputDto;

  /**
   * documents: FileDocument[]
   */
  documents: ClaimSubmissionFileDocument[];

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
   * memberSearchResult: MemberOutputDto[]
   */
  memberSearchResult: ClaimSubmissionMember[];

  /**
   * associatedProviderResult: ProviderOutputDto[]
   */
  associatedProviderResult: ProviderOutputDto[];

  /**
   * groupId?: number
   */
  groupId?: number;

   /**
   * countryId?: number;
   */
  countryOfServiceId?: number;
}
