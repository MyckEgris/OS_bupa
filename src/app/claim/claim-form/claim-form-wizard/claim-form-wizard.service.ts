/**
* claim-form-wizard.service.ts
*
* @description: This class contains the logic for claim form wizard service.
* @version 1.0
*
**/

import { Injectable } from '@angular/core';
import { ClaimFormWizard } from './entities/ClaimFormWizard';
import { FormGroup, FormControl, FormArray, FormBuilder } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { AuthService } from '../../../security/services/auth/auth.service';
import { ClaimSubmissionDocumentType } from 'src/app/shared/classes/claimSubmissionDocumentType.enum';
import { ClaimSubmissionModel } from 'src/app/shared/services/claim-submission/entities/ClaimSubmissionModel';
import { ClaimSubmissionSender } from 'src/app/shared/services/claim-submission/entities/ClaimSubmissionSender';
import * as moment from 'moment';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { MemberOutputDto } from 'src/app/shared/services/policy/entities/member';
import { ClaimSubmissionMember } from 'src/app/shared/services/claim-submission/entities/ClaimSubmissionMember';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { PolicyHelperService } from 'src/app/shared/services/policy-helper/policy-helper.service';
import { UploadService } from 'src/app/shared/upload/upload.service';

@Injectable({
  providedIn: 'root'
})
export class ClaimFormWizardService {

  /**
  * ClaimSubmissionWizard Object
  */
  private claimFormWizard: ClaimFormWizard;

  /**
  * ClaimSubmissionWizard Subject
  */
  private claimFormWizardSubject: Subject<ClaimFormWizard>;

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
  * Constant for initial value in any parameter for zero value
  */
  private INITIAL_VALUE_ZERO = 0;

  /**
  * User Rol enum
  */
  public rol = Rol;

  /**
  * Constant for QUESTIONARY_ID
  */
  public QUESTIONARY_ID = 8;

  /**
  * Constant descriptionOfService control name.
  */
  public DESCRIPTION_CTRL = 'descriptionOfService';

  public fileNameSend: Array<any>;

  public claimList: FormArray;

  public claimListTwo: FormArray;

  public dataResponse: any[] = [];

  public claimBatchId: number | null = null;
  /**



  * Constructor Method
  * @param auth Auth Service Injection
  */



  constructor(
    private auth: AuthService,
    private policyHelper: PolicyHelperService,
    private uploadService: UploadService,
    private fb: FormBuilder,
  ) {
    this.claimFormWizardSubject = new Subject<ClaimFormWizard>();
    this.claimList = this.fb.array([]);
  }

  /**
  *  Begin wizard service instance.
  */
  beginWizard(fn, step?: number, user?: any): Subscription {

    const subscription = this.claimFormWizardSubject.subscribe(fn);

    if (!this.claimFormWizard) {
      this.createNewWizard();
    }
    if (step) {
      this.claimFormWizard.currentStep = step;
    }
    if (user) {
      this.claimFormWizard.user = user;
    }
    this.next();
    return subscription;
  }

  /**
  * Begin wizard service instance.
  */
  continueWizard(step?: number, user?: any): ClaimFormWizard {
    if (step) {
      this.claimFormWizard.currentStep = step;
    }
    if (user) {
      this.claimFormWizard.user = user;
    }
    this.next();
    return this.claimFormWizard;
  }

  /**
  * End wizard service instance and format subject.
  */
  endWizard() {
    this.createNewWizard();
    this.next();
  }

  /**
  * Create a new wizard object.
  */
  createNewWizard() {
    this.claimFormWizard = {
      currentStep: 0,
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
        policyNames: new FormControl('', []),
        policyLastNames: new FormControl('', []),
        policyLegacy: new FormControl('', []),
        startDate: new FormControl('', []),
        associatedProvider: new FormControl('', []),
        firstName: new FormControl('', []),
        surName: new FormControl('', []),
        mailMember: new FormControl('', []),
        phone: new FormControl('', []),
        claimFormQ1: new FormControl('', []),
        claimFormQ2: new FormControl('', []),
        claimFormQ3: new FormControl('', []),
        companyName: new FormControl('', []),
        policyNumber: new FormControl('', []),
        diagnostic: new FormControl('', []),
        treatmentStartDate: new FormControl('', []),
        hospitalStartDate: new FormControl('', []),
        hospitalEndDate: new FormControl('', []),
        hospitalName: new FormControl('', []),
        amount: new FormControl('', []),
        searchClaimType: new FormControl('', []),
        claimFormPayType: new FormControl('', []),
        bankAccountName: new FormControl('', []),
        bankAccountNumber: new FormControl('', []),
        bankAccountClabe: new FormControl('', []),
        bankAccountCurrency: new FormControl('', []),
        diagnosticStartDate: new FormControl('', []),
        firstDiagnosticStartDate: new FormControl('', []),
        listPlaceDiagnoctic: new FormControl('', []),
        isOtherCalim: new FormControl('', []),
        isRoutine: new FormControl('', []),
        isRefund: new FormControl('', []),
        isAccident: new FormControl('', []),
        isHospital: new FormControl('', []),
        otherAnswer: new FormControl('', []),
        isAcceptTerms: new FormControl('', []),
        memebers: new FormControl(null),
        policyValue: new FormControl(null, []),
      }),
      enrollmentForm: new FormGroup({}),
      memberSearchResult: null,
      policySearchResult: null,
      associatedProviderResult: null,
      groupId: null,
      claimFormQuestionary: null,
      policyHolder: null,
      agreementAccepted: null
    };
  }

  /**
  * Propagate parameters to wizard subscriptors.
  */
  private next() {
    this.claimFormWizardSubject.next(this.claimFormWizard);
  }

  /**
   * Build claims submission reactive form
   */
  buildClaimSubmission() {
    const user = this.auth.getUser();
    this.claimFormWizard.claimSubmission = this.getInitialClaimSubmission(user);
    for (const fileDocument of this.claimFormWizard.documents) {
      this.claimFormWizard.claimSubmission.documentsSubmit.documents.push(
        {
          claimSubmissionDocumentGUID: this.claimFormWizard.folderName,
          claimSubmissionGUID: this.claimFormWizard.claimSubmission.claimSubmissionGuid,
          documentName: (fileDocument.file.fileName ? fileDocument.file.fileName : fileDocument.file.name),
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
  getInitialClaimSubmission(user): ClaimSubmissionModel {
    return {
      claimSubmissionGuid: this.claimFormWizard.claimGuid,
      claimHeaderId: this.INITIAL_VALUE_ZERO,
      partnerClaimReference: '',
      receivedDate: this.DEFAULT_DATE_TIME.toString(),
      inboundChannel: this.INBOUND_CHANNEL_QUICKPAY,
      isComplement: false,
      serviceFromDate: this.handleServiceFromDate().toString(),
      serviceToDate: undefined,
      descriptionOfService: this.handleDescriptionOfService(),
      totalCharges: this.claimFormWizard.searchForm.value.amount,
      amount: this.INITIAL_VALUE_ZERO,
      currencyCode: this.claimFormWizard.currencyCode,
      payTo: this.handlePayTo(),
      sender: this.getSenderForClaimSubmission(user, this.claimFormWizard.policyHolder),
      policy: {
        policyId: + this.claimFormWizard.policyHolder.policyId,
        policyCountry: this.claimFormWizard.policyHolder.policyCountry,
        isGroupPolicy: this.claimFormWizard.policyHolder.isGroupPolicy,
        insuranceBusinessId: this.claimFormWizard.policyHolder.insuranceBusinessId,
        insuranceBusinessName: this.claimFormWizard.member && this.claimFormWizard.member.insuranceBusinessName ? this.claimFormWizard.member.insuranceBusinessName : '',
        groupId: this.claimFormWizard.groupId
      },
      member: this.convertMembersOutputDtoToMemberSearchResult(this.claimFormWizard.member),
      provider: this.claimFormWizard.provider,
      documentsSubmit: {
        folderName: this.claimFormWizard.folderName,
        documents: []
      },
      ClaimPaymentMethodId: this.claimFormWizard.claimPaymentMethoidId,
      bankInformationId: this.claimFormWizard.bankInformationId,
      countryOfServiceId: this.claimFormWizard.countryOfServiceId,
      claimFormQuestionaries: this.claimFormWizard.claimFormQuestionary,
      createClaim: true
    };
  }

  /**
 * Build claims submission reactive form
 */
  buildClaimSubmissionList(serviceFromDateInput: string, serviceToDate: string, totalChargesInput: number, currencyCodeInput: string, claimGuid: string, indexIte: number, countryOfServiceId: number): ClaimSubmissionModel {

    this.fileNameSend = []
    this.fileNameSend = this.uploadService.getAllFilesIndex();

    const user = this.auth.getUser();
    this.claimFormWizard.claimSubmission = this.getInitialClaimSubmissionList(serviceFromDateInput, serviceToDate, totalChargesInput, currencyCodeInput, claimGuid, countryOfServiceId, user);

    for (let i = 0; i < this.fileNameSend.length; i++) {
      const elemento = this.fileNameSend[i];
      if (indexIte == elemento.index)
        this.claimFormWizard.claimSubmission.documentsSubmit.documents.push(
          {
            claimSubmissionDocumentGUID: this.claimFormWizard.folderName,
            claimSubmissionGUID: this.claimFormWizard.claimSubmission.claimSubmissionGuid,
            documentName: elemento.name,//(fileDocument.file.fileName ? fileDocument.file.fileName : fileDocument.file.name),
            documentTypeId: ClaimSubmissionDocumentType.getTypeId(elemento.typeAttachment),
            documentTypeName: ClaimSubmissionDocumentType.getTypeDescription(elemento.typeAttachment)
          }
        );
    }
    return this.claimFormWizard.claimSubmission;
  }


  /**
   * Get initial object for claim submission proccess
   * @param user User
   */
  getInitialClaimSubmissionList(serviceFromDateInput: string, serviceToDate: string, totalChargesInput: number, currencyCodeInput: string, claimGuid: string, countryOfServiceId: number, user): ClaimSubmissionModel {
    return {
      claimSubmissionGuid: claimGuid,
      claimHeaderId: this.INITIAL_VALUE_ZERO,
      partnerClaimReference: '',
      receivedDate: this.DEFAULT_DATE_TIME.toString(),
      inboundChannel: this.INBOUND_CHANNEL_QUICKPAY,
      isComplement: false,
      serviceFromDate: serviceFromDateInput, //dinamico
      serviceToDate: serviceToDate, // dinamico
      descriptionOfService: this.handleDescriptionOfService(),
      totalCharges: totalChargesInput, //dinamico
      amount: this.INITIAL_VALUE_ZERO,
      currencyCode: currencyCodeInput,  //dinamico
      payTo: this.handlePayTo(),
      sender: this.getSenderForClaimSubmission(user, this.claimFormWizard.policyHolder),
      policy: {
        policyId: + this.claimFormWizard.policyHolder.policyId,
        policyCountry: this.claimFormWizard.policyHolder.policyCountry,
        isGroupPolicy: this.claimFormWizard.policyHolder.isGroupPolicy,
        insuranceBusinessId: this.claimFormWizard.policyHolder.insuranceBusinessId,
        insuranceBusinessName: this.claimFormWizard.member && this.claimFormWizard.member.insuranceBusinessName ? this.claimFormWizard.member.insuranceBusinessName : '',
        groupId: this.claimFormWizard.groupId
      },
      member: this.convertMembersOutputDtoToMemberSearchResult(this.claimFormWizard.member),
      provider: this.claimFormWizard.provider,
      documentsSubmit: {
        folderName: this.claimFormWizard.folderName,
        documents: []
      },
      ClaimPaymentMethodId: this.claimFormWizard.claimPaymentMethoidId,
      bankInformationId: this.claimFormWizard.bankInformationId,
      countryOfServiceId: countryOfServiceId, //this.claimFormWizard.countryOfServiceId,
      claimFormQuestionaries: this.claimFormWizard.claimFormQuestionary,
      createClaim: true
    };
  }

  /**
   * Indicates if the claim submission sender is an impersonalized user or the authenticated user
   * @param user User
   */
  getSenderForClaimSubmission(user, policy: PolicyDto): ClaimSubmissionSender {
    const isImpersonalized = this.auth.isImpersonalized();
    const emailPolicyHolder = this.getPolicyHolderEmailFromPolicy(policy, user, isImpersonalized);
    if (isImpersonalized) {
      return this.setSender(user.user_impersonalizes_name, user.user_impersonalizes_user_id,
        +user.user_impersonalizes_role_id, emailPolicyHolder);
    } else {
      return this.setSender(user.name, user.sub, +user.role_id, emailPolicyHolder);
    }
  }

  /**
   * Get Policy Holder Email From Policy
   * @param policy Policy
   * @param user  User
   * @param isImpersonalized Is Impersonalized
   * @returns
   */
  getPolicyHolderEmailFromPolicy(policy: PolicyDto, user: any, isImpersonalized: boolean): string {

    if (policy && policy.emails &&
      ((+user.role_id !== Rol.POLICY_HOLDER &&
        +user.role_id !== Rol.GROUP_POLICY_HOLDER) || isImpersonalized)) {
      const email = policy.emails.find(x => x.emailTypeId === 1);
      return email ? email.eMailAddress : '';
    } else {
      return '';
    }
  }

  /**
   * Set parameters and return ClaimSubmissionSender
   * @param name Name
   * @param email Email
   * @param roleId Role Id
   * @param emailCC Email CC
   */
  setSender(name: string, email: string, roleId: number, emailCC: string) {
    return {
      senderFullName: name,
      senderEmailAddress: email,
      senderEmailCCAddress: emailCC,
      senderTypeId: roleId
    };
  }

  /**
   * This function allows to gets all the document files from array filtering by category.
   * @param category Document file category.
   */
  public getDocumentsByCategory(category: string) {
    return this.claimFormWizard.documents.filter(x => x.category === category);
  }

  /**
   * Convert MemberOutputDto to ClaimSubmissionMember
   */
  public convertMembersOutputDtoToMemberSearchResult(member: MemberOutputDto): ClaimSubmissionMember {
    return {
      memberId: member.memberId,
      firstName: member.firstName,
      middleName: member.middleName,
      lastName: member.lastName,
      fullName: member.fullName,
      dob: (member.dob ? new Date(member.dob) : null),
      policyId: member.policyId,
      policyNumber: (member.policyNumber ? member.policyNumber.toString() : ''),
      isGroupPolicy: member.isGroupPolicy,
      groupId: member.groupId,
      applicationId: (member.applicationId ? member.applicationId.toString() : ''),
      contactBaseId: member.contactBaseId,
      memberStatus: member.memberStatus,
      policyStatus: member.policyStatus,
      policyCountryId: member.policyCountryId,
      policyCountry: member.policyCountry,
      insuranceBusinessName: member && member.insuranceBusinessName ? member.insuranceBusinessName : '',
      insuranceBusinessId: member && member.insuranceBusinessId ? member.insuranceBusinessId : null,
      relationTypeId: member.relationTypeId,
      relationType: member.relationType,
      genderId: member.genderId,
      gender: member.gender,
      searchDate: (member.searchDate ? new Date(member.searchDate) : null),
      referenceNumber: member.referenceNumber,
      requesterName: member.requesterName,
      transactionId: member.transactionId,
      email: member.email,
      policyReference: member.policyReference,
      phoneNumber: 0
    };
  }

  /**
   * Handle payTo parameter.
   */
  handlePayTo() {
    if (this.claimFormWizard.user.role_id === String(this.rol.AGENT) ||
      this.claimFormWizard.user.role_id === String(this.rol.AGENT_ASSISTANT) ||
      this.claimFormWizard.user.role_id === String(this.rol.GROUP_ADMIN)) {
      return this.PAY_TO_MEMBER_VALUE;
    }
    if (this.claimFormWizard.user.role_id === String(this.rol.PROVIDER)) {
      return this.PAY_TO_PROVIDER_VALUE;
    }
    if (this.claimFormWizard.user.role_id === String(this.rol.POLICY_HOLDER) ||
      this.claimFormWizard.user.role_id === String(this.rol.GROUP_POLICY_HOLDER)
      || this.claimFormWizard.user.role_id === String(this.rol.POLICY_MEMBER)) {
      return this.PAY_TO_MEMBER_VALUE;
    }
  }

  /**
   * Handle serviceFromDate parameter.
   */
  handleServiceFromDate() {
    return moment(this.claimFormWizard.searchForm.value.treatmentStartDate).format('YYYY-MM-DD');
  }

  getAnswer() {
    return [
      {
        questionaryId: this.QUESTIONARY_ID,
        medicalQuestionId: this.claimFormWizard.claimFormQuestionary[0].medicalQuestionId,
        medicalQuestionParentId: null,
        medicalQuestion: this.claimFormWizard.claimFormQuestionary[0].medicalQuestion,
        answer: this.claimFormWizard.claimFormQuestionary[0].answer
      },
      {
        questionaryId: this.QUESTIONARY_ID,
        medicalQuestionId: this.claimFormWizard.claimFormQuestionary[1].medicalQuestionId,
        medicalQuestionParentId: null,
        medicalQuestion: this.claimFormWizard.claimFormQuestionary[1].medicalQuestion,
        answer: this.claimFormWizard.claimFormQuestionary[1].answer
      },
    ];
  }

  /**
  * Handles description of service field value according tu user insurance.
  */
  public handleDescriptionOfService(): string {
    const user = this.auth.getUser();
    if (this.policyHelper.isPolicyNatureTravel(this.claimFormWizard.policyHolder.policyNatureId) &&
      this.claimFormWizard.searchForm.contains(this.DESCRIPTION_CTRL)) {
      const descValue = this.claimFormWizard.searchForm.get(this.DESCRIPTION_CTRL) as FormControl;
      return descValue.value;
    } else {
      return '';
    }
  }

  getClaims() {
    return this.claimList;
  }

  addClaim(claimFormGroup: FormGroup) {
    this.claimList.push(claimFormGroup);
  }

  removeClaim(index: number): void {
    if (index >= 0 && index < this.claimList.length) {
      this.claimList.removeAt(index);
    }
  }
  removeClaimAll(){
    this.claimList = this.fb.array([]);
  }
}
