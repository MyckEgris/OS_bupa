/**
* ClaimSubmissionModel.ts
*
* @description: Model claim submission
* @author Yefry Lopez
* @version 1.0
* @date 10-10-2018.
*
**/

import { ClaimSubmissionMember } from './ClaimSubmissionMember';
import { ProviderOutputDto } from '../../provider/entities/provider.dto';
import { ClaimSubmissionSender } from './ClaimSubmissionSender';
import { ClaimSubmissionPolicy } from './ClaimSubmissionPolicy';
import { ClaimSubmissionDocumentSubmit } from './ClaimSubmissionDocumentSubmit';
import { ClaimFormQuestionary } from './ClaimFormQuestionary';

/**
 * Model claim submission
 */
export interface ClaimSubmissionModel {
  claimSubmissionGuid: string;
  claimHeaderId: number;
  partnerClaimReference: string;
  receivedDate: string;
  inboundChannel: string;
  isComplement: boolean;
  serviceFromDate: string;
  serviceToDate: string;
  descriptionOfService: string;
  totalCharges: number;
  amount: number;
  currencyCode: string;
  payTo: string;
  sender: ClaimSubmissionSender;
  policy: ClaimSubmissionPolicy;
  member: ClaimSubmissionMember;
  provider: ProviderOutputDto;
  documentsSubmit: ClaimSubmissionDocumentSubmit;
  createClaim: boolean;
  ClaimPaymentMethodId?: number;
  bankInformationId?: number;
  countryOfServiceId?: number;
  claimFormQuestionaries?: any;
}
