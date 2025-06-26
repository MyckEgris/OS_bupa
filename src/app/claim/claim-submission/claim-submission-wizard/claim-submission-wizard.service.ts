/**
* claim-submission-wizardService.ts
*
* @description: This class interacts with ClaimSubmissionWizard API.
* @author Yefry Lopez.
* @version 1.0
* @date 09-10-2018.
*
**/

import { Injectable } from '@angular/core';
import { ClaimSubmissionWizard } from './entities/ClaimSubmissionWizard';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from '../../../security/services/auth/auth.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { ClaimSubmissionDocumentType } from 'src/app/shared/classes/claimSubmissionDocumentType.enum';
import { ClaimSubmissionModel } from 'src/app/shared/services/claim-submission/entities/ClaimSubmissionModel';
import { ClaimSubmissionSender } from 'src/app/shared/services/claim-submission/entities/ClaimSubmissionSender';
import * as moment from 'moment';
import { Rol } from 'src/app/shared/classes/rol.enum';


/**
 * This class interacts with ClaimSubmissionWizard API.
 */
@Injectable({
  providedIn: 'root'
})
export class ClaimSubmissionWizardService {

  /**
   * ClaimSubmissionWizard Object
   */
  private claimSubmission: ClaimSubmissionWizard;

  /**
   * ClaimSubmissionWizard Subject
   */
  private claimSubmissionSubject: Subject<ClaimSubmissionWizard>;

  /**
   * Constant for default datetime value
   */
  private DEFAULT_DATE_TIME = moment().format('YYYY-MM-DD HH:mm');

  /**
   * Constant for pay to provider
   */
  private PAY_TO_PROVIDER_VALUE = 'PROVIDER';

  /**
   * Constant for pay to member
   */
  private PAY_TO_MEMBER_VALUE = 'MEMBER';


  /**
   * Constant for inbound channel
   */
  private INBOUND_CHANNEL_QUICKPAY = 'Web-single';

  /**
   * Constant for inbound channel
   */
  private INBOUND_CHANNEL_MASSMNGT= 'Web-multiple';

  /**
   * Constant for updated by
   */
  private UPDATED_BY_TYPE = 'string';

  /**
   * COnstant for detail
   */
  private DETAIL_VALUE = 'Claim';

  /**
   * Constant for initial value in any parameter for zero value
   */
  private INITIAL_VALUE_ZERO = 0;

  /**
   * Constant for Other documents documenType
   */
  private DOC_TYPE_OTHER = 1;

  /**
   * Constant for International Bill documenType
   */
  private DOC_TYPE_BILL = 2;

  /**
   * Constant for status id
   */
  private INITIAL_STATUS_ID = 1;

  /**
   * Constant for parseInt radix
   */
  private PARSE_INT_RADIX_VALUE = 0;

  /**
   * User Rol enum
   */
  public rol = Rol;

  /**
   * Const to Identify the multi_provider sub step component
   */
  public STEP2_MULTI_PROVIDER = 'multi_provider';



  /**
   * Constructor Method
   * @param common Common Service Injection
   * @param auth Auth Service Injection
   */
  constructor(
    private common: CommonService,
    private auth: AuthService) {
    this.claimSubmissionSubject = new Subject<ClaimSubmissionWizard>();
  }



  /**
   *  Initiate Claim submission wizard.
   * @fn subscription function
   */
  beginClaimSubmissionWizard(fn, step?: number, subStep?: string): Subscription {
    const subscription = this.claimSubmissionSubject.subscribe(fn);
    if (!this.claimSubmission) {
      this.newClaimSubmission();
    }
    if (step) {
      this.claimSubmission.currentStep = step;
    }

    if (subStep) {
      this.claimSubmission.currentSubStep = subStep;
    }
    this.next();
    return subscription;

  }

  /**
   * Close the wizard of claim submission
   */
  endClaimSubmissionWizard() {
    this.newClaimSubmission();
    this.next();
  }

  /**
   * Create a new claim submission.
   */
  private newClaimSubmission() {
    this.claimSubmission = {
      currentStep: 0,
      currentSubStep: null,
      member: null,
      associatedProvider: null,
      documents: [],
      folderName: '',
      claimGuid: '',
      statusGuid: '',
      claimSubmission: null,
      user: null,
      provider: null,
      searchForm: new FormGroup({
        policyId: new FormControl('', []),
        startDate: new FormControl('', []),
        associatedProvider: new FormControl('', []),
      }),
      memberSearchResult: null,
      associatedProviderResult: null,
      groupId: null
    };
  }

  /**
   * Send parameters to subscriptors
   */
  private next() {
    this.claimSubmissionSubject.next(this.claimSubmission);
  }

  /**
   * Build claims submission reactive form
   * @param claimGuid claimGuid.
   */
  buildClaimSubmission(claimGuid: string) {
    const user = this.auth.getUser();
    this.claimSubmission.claimSubmission = this.getInitialClaimSubmission(user, claimGuid);
    for (const fileDocument of this.claimSubmission.documents) {
      this.claimSubmission.claimSubmission.documentsSubmit.documents.push(
        {
          claimSubmissionDocumentGUID: this.claimSubmission.folderName,
          claimSubmissionGUID: this.claimSubmission.claimSubmission.claimSubmissionGuid,
          documentName: fileDocument.file.name,
          documentTypeId: ClaimSubmissionDocumentType.getTypeId(fileDocument.category),
          documentTypeName: ClaimSubmissionDocumentType.getTypeDescription(fileDocument.category)
        }
      );
    }
  }

  /**
   * Get initial object for claim submission proccess
   * @param user User
   */
  getInitialClaimSubmission(user, claimGuid: string): ClaimSubmissionModel {
    return {
      claimSubmissionGuid: claimGuid,
      claimHeaderId: this.INITIAL_VALUE_ZERO,
      partnerClaimReference: '',
      receivedDate: this.DEFAULT_DATE_TIME.toString(),
      inboundChannel: this.handleInboundCreateClaim(),
      isComplement: false,
      serviceFromDate: this.handleServiceFromDate().toString(),
      serviceToDate: undefined,
      descriptionOfService: '',
      totalCharges: this.INITIAL_VALUE_ZERO,
      amount: this.INITIAL_VALUE_ZERO,
      currencyCode: '',
      payTo: this.handlePayTo(),
      sender: this.getSenderForClaimSubmission(user),
      policy: {
        policyId: +this.claimSubmission.member.policyId,
        policyCountry: this.claimSubmission.member.policyCountry,
        isGroupPolicy: this.claimSubmission.member.isGroupPolicy,
        insuranceBusinessId: this.claimSubmission.member.insuranceBusinessId,
        insuranceBusinessName: this.claimSubmission.member.insuranceBusinessName,
        groupId: this.claimSubmission.groupId
      },
      member: this.claimSubmission.member,
      provider: this.claimSubmission.provider,
      documentsSubmit: {
        folderName: this.claimSubmission.folderName,
        documents: []
      },
      countryOfServiceId: this.claimSubmission.countryOfServiceId,
      createClaim: true,
    };
  }

  /**
   * Indicates if the claim submission sender is an impersonalized user or the authenticated user
   * @param user User
   */
  getSenderForClaimSubmission(user): ClaimSubmissionSender {
    const isImpersonalized = this.auth.isImpersonalized();
    if (isImpersonalized) {
      return this.setSender(user.user_impersonalizes_name, user.user_impersonalizes_user_id, +user.user_impersonalizes_role_id);
    } else {
      return this.setSender(user.name, user.sub, +user.role_id);
    }
  }

  /**
   * Set parameters and return ClaimSubmissionSender
   * @param name Name
   * @param email Email
   * @param roleId Role Id
   */
  setSender(name, email, roleId) {
    return {
      senderFullName: name,
      senderEmailAddress: email,
      senderTypeId: roleId
    };
  }

  /**
   * This function allows to gets all the document files from array filtering by category.
   * @param category Document file category.
   */
  public getDocumentsByCategory(category: string) {
    return this.claimSubmission.documents.filter(x => x.category === category);
  }

  /**
   * Handle createClaim parameter.
   */
  handleCreateClaim() {
    if (this.claimSubmission.currentSubStep === this.STEP2_MULTI_PROVIDER) {
      return true;  
    } else {
      return false;
    }
  }

  /**
   * Handle payTo parameter.
   */
  handlePayTo() {
    if (this.claimSubmission.user.role_id === String(this.rol.AGENT) ||
      this.claimSubmission.user.role_id === String(this.rol.AGENT_ASSISTANT) ||
      this.claimSubmission.user.role_id === String(this.rol.GROUP_ADMIN)) {
      return this.PAY_TO_MEMBER_VALUE;
    }
    if (this.claimSubmission.user.role_id === String(this.rol.PROVIDER)) {
      return this.PAY_TO_PROVIDER_VALUE;
    }
    if (this.claimSubmission.user.role_id === String(this.rol.POLICY_HOLDER) ||
      this.claimSubmission.user.role_id === String(this.rol.GROUP_POLICY_HOLDER)) {
      return this.PAY_TO_MEMBER_VALUE;
    }
  }

  /**
   * Handle serviceFromDate parameter.
   */
  handleServiceFromDate() {
    return moment(this.claimSubmission.searchForm.value.startDate).format('YYYY-MM-DD');
  }

  /**
   * Handle identify createClaim parameter.
   */
  handleInboundCreateClaim() {
    if (this.claimSubmission.currentSubStep === this.STEP2_MULTI_PROVIDER) {
      return this.INBOUND_CHANNEL_QUICKPAY;  
    } else {
      return this.INBOUND_CHANNEL_MASSMNGT;
    }
  }

}
