import { Member } from './../../../shared/services/policy-application/entities/member';
import { Email } from './../../../shared/services/policy-application/entities/email';
import { Utilities } from 'src/app/shared/util/utilities';
import { AgentService } from 'src/app/shared/services/agent/agent.service';
import { Agent } from 'src/app/shared/services/agent/entities/agent';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { AuthService } from './../../../security/services/auth/auth.service';
import { Injectable } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { PolicyApplicationWizard } from './entities/policy-application-wizard';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { PolicyApplicationModel } from 'src/app/shared/services/policy-application/entities/policy-application-model';
import { Phone } from 'src/app/shared/services/policy-application/entities/phone';
import { UploadService } from 'src/app/shared/upload/upload.service';

@Injectable({
  providedIn: 'root'
})
export class PolicyApplicationWizardService {


  private user: any;

  private agent: Agent;

  /**
   * policyApplicationSubject Subject
   */
  private policyApplicationSubject: Subject<PolicyApplicationWizard>;

  /**
   * PolicyApplicationWizard Object
   */
  private policyApplication: PolicyApplicationWizard;

  /**
   * Constant for initial value in any parameter for zero value
   */
  private INITIAL_VALUE_ZERO = 0;

  /**
   * Constant office
   */
  private OFFICE = 1001;

  /**
   * Constant preferred email
   */
  private PREFERRED_EMAIL = 1;

  constructor(
    private auth: AuthService,
    private agentService: AgentService,
    private translationService: TranslationService,
    private uploadService: UploadService
  ) {
    this.policyApplicationSubject = new Subject<PolicyApplicationWizard>();
  }

  /**
   *  Initiate Claim submission wizard.
   * @fn subscription function
   */
  beginPolicyApplicationWizard(fn, user, step?: number): Subscription {
    this.user = user;
    const subscription = this.policyApplicationSubject.subscribe(fn);
    if (!this.policyApplication) {
      this.newPolicyApplication(user);
    }
    if (step) {
      this.policyApplication.currentStep = step;
    }
    this.next();
    return subscription;
  }

  /**
   * Close the wizard of claim submission
   */
  endPolicyApplicationWizard(user) {
    this.newPolicyApplication(user);
    this.uploadService.removeAllDocuments();
    this.next();
  }

  /**
   * Send parameters to subscriptors
   */
  private next() {
    this.policyApplicationSubject.next(this.policyApplication);
  }


  /**
   * Create a new claim submission.
   */
  private newPolicyApplication(user) {
    this.policyApplication = {
      currentStep: 0,
      languageId: 0,
      language: '',
      insuranceBusinessId: 0,
      policyId: '',
      agentId: 0,
      agent: '',
      process: '',
      businessInsuranceId: 0,
      businessInsurance: '',
      countryId: 0,
      countryName: '',
      cityId: 0,
      cityName: '',
      productId: 0,
      productName: '',
      planId: 0,
      planName: '',
      policyForm: new FormGroup({
        applicantRole: new FormControl(user.role, Validators.required),
        applicantName: new FormControl(`${user.name} ${user.family_name}`, Validators.required),
        agentName: new FormControl(user.name, Validators.required),
        phone: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, CustomValidator.emailPatternValidator]),
        insuranceBusiness: new FormControl('', Validators.required),
        date: new FormControl('', Validators.required),
        country: new FormControl(null, Validators.required),
        city: new FormControl(null, Validators.required),
        product: new FormControl(null, Validators.required),
        plan: new FormControl(null, Validators.required),
        holderName: new FormControl('', Validators.required),
        holderSurname: new FormControl('', Validators.required),
        holderBirthDate: new FormControl('', [Validators.required, CustomValidator.dateValueRange]),
        holderPhone: new FormControl('', [Validators.required]),
        holderEmail: new FormControl('', [Validators.required, CustomValidator.emailPatternValidator])
      }),
      policyApplication: null,
      documents: [],
      folderName: '',
      folderNameByCategory: [],
      policyApplicationGuid: '',
      phoneGuid: '',
      emailGuid: '',
      memberGuid: '',
      statusGuid: ''
    };
    this.setUpForm();
  }

  /**
   * Build claims submission reactive form
   */
  buildPolicyApplication() {
    const user = this.auth.getUser();
    this.policyApplication.policyApplication = this.getInitialPolicyApplication(user);

    for (const fileDocument of this.policyApplication.documents) {
      const guid = this.uuidv4();
      this.policyApplication.policyApplication.documents.push(
        {
          applicationDocumentGuid: guid,
          applicationGuid: this.policyApplication.policyApplication.applicationGuid,
          documentName: this.getFolderNameByCategoryId(fileDocument.category) + '\\' + fileDocument.file.name,
          applicationDocumentTypeId: + this.getCategoryId(fileDocument.category)
        }
      );
    }
  }

  getCategoryId(category: string) {
    return category.charAt(category.length - 1);
  }

  getFolderNameByCategoryId(category: string): string {
    const folderNameByCategory = this.policyApplication.folderNameByCategory.filter(x => x.category === category);
    return folderNameByCategory[0].folder;
  }

  /**
   * Get initial object for policy application proccess
   * @param user User
   */
  getInitialPolicyApplication(user): PolicyApplicationModel {
    return {
      applicationGuid: this.policyApplication.policyApplicationGuid,
      applicationId: this.INITIAL_VALUE_ZERO,
      agentId: this.policyApplication.agentId,
      agent: this.policyApplication.agent,
      policyId: this.policyApplication.policyId,
      process: this.policyApplication.process,
      enrollmentTypeId: 1,
      enrollmentType: 'Application',
      requestorFirstName: this.getRequestorInformation('first_name', user),
      requestorLastName: this.getRequestorInformation('last_name', user),
      requestorTypeId: this.getRequestorInformation('type_id', user),
      requestorType: this.getRequestorInformation('type', user),
      requestorEmail: this.getRequestorInformation('email', user),
      requestorPhone: this.getRequestorInformation('phone', user),
      issueDate: this.policyApplication.policyForm.controls['date'].value,
      stampDate: this.policyApplication.policyForm.controls['date'].value,
      signedDate: Utilities.getDateNow(),
      countryId: this.policyApplication.countryId,
      country: this.policyApplication.countryName,
      cityId: this.policyApplication.cityId,
      city: this.policyApplication.cityName,
      productId: this.policyApplication.productId,
      product: this.policyApplication.productName,
      planId: this.policyApplication.planId,
      plan: this.policyApplication.planName,
      insuranceBusinessId: this.policyApplication.businessInsuranceId,
      insuranceBusiness: this.policyApplication.businessInsurance,
      businessModeId: 1,
      businessMode: 'Health_Individual',
      receivedMethodId: 5,
      receiveMethod: 'Online',
      languageId: this.translationService.getLanguageId(),
      language: this.translationService.getLanguage(),
      modeOfPaymentId: null,
      modeOfPayment: null,
      paymentMethodId: 5,
      paymentMethod: '_unknown',
      updatedBy: user.name,
      updatedOn: null,
      status: 'Pending Information',
      createdOn: Utilities.getDateNow(),
      daysElapsed: this.INITIAL_VALUE_ZERO,
      addresses: [],
      phones: [this.getInitialPhone(this.policyApplication.phoneGuid, this.policyApplication.policyApplicationGuid,
        this.policyApplication.policyForm.get('holderPhone').value, this.policyApplication.countryId)],
      emails: [this.getInitialEmail(this.policyApplication.emailGuid, this.policyApplication.policyApplicationGuid,
        this.policyApplication.policyForm.get('holderEmail').value)],
      members: [this.getInitialMember(this.policyApplication.memberGuid, this.policyApplication.policyApplicationGuid,
        this.policyApplication.policyForm.get('holderName').value, this.policyApplication.policyForm.get('holderSurname').value,
        this.policyApplication.policyForm.get('holderBirthDate').value)],
      riders: [],
      petitioner: null,
      documents: [],
      paperless: false,
      petitionerTypeId: 0,
      identifications: [],
      viewTemplateId: 0,
      beneficiary: null,
      otherInsurance: null,
      agreements: [],
      promoterKey: null,
      promoterEmail: null,
      medicalQuestion: [],
      medicalHistory: [],
      creditCard: null,
      rules: []
    };
  }


  /**
   * Get requestor information according agent (company, person) and if is impersonalized
   * @param field field
   * @param user user
   */
  getRequestorInformation(field, user) {
    const isImpersonalized = this.auth.isImpersonalized();
    switch (field) {
      case 'first_name':
        return (isImpersonalized ? user.user_impersonalizes_name :
          (this.agent.companyName === '' ? `${this.agent.firstName} ${this.agent.middleName}` : this.agent.companyName));
      case 'last_name':
        return (isImpersonalized ? user.user_impersonalizes_given_name :
          (this.agent.companyName === '' ? this.agent.lastName : this.agent.companyName));
      case 'type_id':
        return (isImpersonalized ? user.user_impersonalizes_role_id : user.role_id);
      case 'type':
        return (isImpersonalized ? user.user_impersonalizes_role : user.role);
      case 'email':
        return (isImpersonalized ? user.user_impersonalizes_user_id :
          this.agent.emails.filter(email => email.emailTypeId === this.PREFERRED_EMAIL)[0].eMailAddress);
      case 'phone':
        return (isImpersonalized ? '' :
          this.agent.phones.filter(phone => phone.phoneTypeId === this.OFFICE)[0].phoneNumber);
      default:
        return '';
    }
  }

  /**
   * Get initial phone
   * @param phoneGuid phone guid
   * @param applicationGuid application Guid
   * @param phoneNumber phone Number
   * @param phoneNumber phoneNumber
   */
  getInitialPhone(phoneGuid, applicationGuid, phoneNumber, countryId): Phone {
    const phone: Phone = {} as any;
    phone.applicationPhoneGuid = phoneGuid;
    phone.applicationGuid = applicationGuid;
    phone.contactType = this.INITIAL_VALUE_ZERO;
    phone.phoneTypeId = 1000;
    phone.phoneNumber = phoneNumber;
    phone.ext = null;
    phone.countryId = countryId;
    phone.areaCodeId = null;
    phone.phoneType = 'Home';
    phone.areaCode = null;
    phone.fullPhone = null;

    return phone;
  }

  getInitialEmail(emailGuid, applicationGuid, emailAddress) {
    const email: Email = {} as any;
    email.applicationEmailGuid = emailGuid;
    email.applicationGuid = applicationGuid;
    email.contactType = this.INITIAL_VALUE_ZERO;
    email.emailTypeId = 1;
    email.emailAddress = emailAddress;

    return email;
  }

  getInitialMember(memberGuid, applicationGuid, firstName, lastName, dob) {
    const member: Member = {} as any;
    member.applicationMemberGuid = memberGuid;
    member.applicationGuid = applicationGuid;
    member.firstName = firstName;
    member.middleName = null;
    member.lastName = lastName;
    member.dob = dob;
    member.genderId = 1;
    member.systemMeasureId = null;
    member.weight = null;
    member.height = null;
    member.fullTimeStudent = null;
    member.schoolName = null;
    member.usCitizenResident = null;
    member.nationality = null;
    member.maritalStatusId = 5;
    member.relationTypeId = 2;
    member.dependentRelationId = 1;
    member.ocupationId = null;
    member.previousPolicyId = null;
    member.previousMemberId = null;
    member.gender = null;
    member.systemMeasure = null;
    member.nationality = null;
    member.maritalStatus = null;
    member.relationType = null;
    member.dependentRelation = null;
    member.ocupation = null;

    return member;
  }

  /**
   * set the initial variables for wizard form
   */
  setUpForm() {
    this.agentService.getAgentById(this.user.agent_number).subscribe(agent => {
      this.agent = agent;
      const agentPhone = agent.phones.filter(phone => phone.phoneTypeId === this.OFFICE)[0].phoneNumber;
      const agentEmail = agent.emails.filter(email => email.emailTypeId === this.PREFERRED_EMAIL)[0].eMailAddress;
      this.policyApplication.policyForm.controls['phone'].setValue(agentPhone);
      this.policyApplication.policyForm.controls['email'].setValue(agentEmail);
      this.policyApplication.policyForm.controls['insuranceBusiness'].setValue(agent.insuranceBusiness);
      this.policyApplication.policyForm.controls['agentName'].setValue(agent.agentId);
      this.setInitialWizardValues(agent);
    });
  }

  setInitialWizardValues(agent) {
    this.policyApplication.agentId = agent.agentId;
    this.policyApplication.agent = this.agentService.getAgentName(agent);
    this.policyApplication.businessInsuranceId = agent.insuranceBusinessId;
    this.policyApplication.businessInsurance = agent.insuranceBusiness;
    this.policyApplication.process = 'PolicyApplication';
    this.policyApplication.languageId = this.translationService.getLanguageId();
    this.policyApplication.language = this.translationService.getLanguageName();
    this.policyApplication.policyId = null;
  }

  /**
   * provisional guid generator
   */
  /* tslint:disable */
  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * return translation string for each role
   * @param role role string
   */
  getRoleTranslated(role: string) {
    switch (role) {
      case 'Agent':
        return 'POLICY.APPLICATION.STEP1.CONTACT_INFORMATION.AGENT';
      case 'AgentAssistant':
        return 'POLICY.APPLICATION.STEP1.CONTACT_INFORMATION.AGENT_ASSISTANT';
      case 'GroupAdmin':
        return 'POLICY.APPLICATION.STEP1.CONTACT_INFORMATION.GROUP_ADMIN_AGENT';
    }
  }

}
