import { find } from 'rxjs/operators';
import { Injectable, SecurityContext } from '@angular/core';
import { PolicyEnrollmentWizard } from './entities/policy-enrollment-wizard';
import { Subject, Subscription, forkJoin } from 'rxjs';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Control } from 'src/app/shared/services/view-template/entities/control';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyApplicationModel } from 'src/app/shared/services/policy-application/entities/policy-application-model';
import { Utilities } from 'src/app/shared/util/utilities';
import { AgentService } from 'src/app/shared/services/agent/agent.service';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { Member } from 'src/app/shared/services/policy-application/entities/member';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { PhoneTypes } from 'src/app/shared/services/policy-application/constants/phone-types.enum';
import { Address } from 'src/app/shared/services/policy-application/entities/address';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { RelationType } from 'src/app/shared/classes/relation-type-member.enum';
import { ContactTypes } from 'src/app/shared/services/policy-application/constants/contact-types.enum';
import { MedicalQuestionsTransformService } from './mappers-services/medical-questions-transform.service';
import { PetitionerType } from 'src/app/shared/classes/petitioner-type.enum';
import { FileDocument } from 'src/app/shared/services/common/entities/fileDocument';
import { PolicyEnrollmentTransformBeneficiaryService } from './mappers-services/policy-enrollment-transform-beneficiary.service';
import { PolicyEnrollmentTransformConsentsService } from './mappers-services/policy-enrollment-transform-consents.service';
import { PolicyEnrollmentTransformMembersService } from './mappers-services/policy-enrollment-transform-members.service';
import { PolicyEnrollmentTransformPetitionerService } from './mappers-services/policy-enrollment-transform-petitioner.service';
import { PolicyEnrollmentTransformOwnerPetitionerService } from './mappers-services/policy-enrollment-transform-owner-petitioner.service';
import { PolicyEnrollmentTransformOwnerService } from './mappers-services/policy-enrollment-transform-owner.service';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentTransformProductPlanRidersService } from './mappers-services/policy-enrollment-transform-product-plan-riders.service';
import { PolicyEnrollmentTransformOtherInsuranceService } from './mappers-services/policy-enrollment-transform-other-insurance.service';
import { PolicyEnrollmentTransformPaymentDetailsService } from './mappers-services/policy-enrollment-transform-payment-details.service';
import { PolicyApplicationResponse } from 'src/app/shared/services/policy-application/entities/policy-application-response.dto';
import { TransformOwnerService } from './mappers-services-pan/transform-owner.service';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { TransformConsentsService } from './mappers-services-pan/transform-consents.service';
import { TransformPetitionerService } from './mappers-services-pan/transform-petitioner.service';
import { AddressTypes } from 'src/app/shared/services/policy-application/constants/address-types.enum';
import { UploadService } from 'src/app/shared/upload/upload.service';
@Injectable({
  providedIn: 'root'
})
export class PolicyEnrollmentWizardService {

  private policyEnrollmentSubject: Subject<PolicyEnrollmentWizard>;
  private policyEnrollment: PolicyEnrollmentWizard;
  private INITIAL_VALUE_ZERO = 0;
  private INITIAL_VALUE_EMPTY = '';
  private INIT_VALUE_ARRAY = [];
  private PREFERRED_EMAIL = 1;
  /***
   * Const to Identify the nested FormControl disclaimerCheck
   */
  public FIRST_AGREE1 = 'disclaimerCheck';

  /***
   * Const to Identify the nested FormControl disclaimerCheck
   */
  public SECOND_AGREE1 = 'disclaimerCheck';

  /***
   * Const to Identify the nested FormControl questionHabeusData
   */
  public SECOND_ANS1 = 'questionHabeusData';

  /***
   * Const to Identify the nested FormControl questionObligations
   */
  public SECOND_ANS2 = 'questionObligations';

  /***
   * Const to Identify the nested FormControl questionScopesAndFunctions
   */
  public SECOND_ANS3 = 'questionScopesAndFunctions';

  /***
   * Const to Identify the nested FormControl disclaimerCheckMedicalInformation
   */
  public THIRD_AGREE1 = 'disclaimerCheckMedicalInformation';

  /***
   * Const to Identify the nested FormControl disclaimerCheckRecognition
   */
  public THIRD_AGREE2 = 'disclaimerCheckRecognition';

  /***
   * Const to Identify the nested FormControl disclaimerCheckLawfulOfResources
   */
  public FOURTH_AGREE1 = 'disclaimerCheckLawfulOfResources';

  /***
   * Const to Identify the nested FormControl disclaimerCheckRecognition
   */
  public FOURTH_AGREE2 = 'disclaimerCheckRecognition';
  /**
   * Creates an instance of policy enrollment wizard service.
   * @param auth
   * @param agentService
   * @param translationService
   * @param formBuilder
   * @param commonService
   * @param policyEnrollmentTransformService
   * @param policyEnrollmentTransformPetitionerService
   * @param medicalQuestionsTransformService
   * @param policyEnrollmentTransformOwnerPetitionerService
   * @param policyEnrollmentTransformOwnerService
   * @param policyEnrollmentTransformProductPlanRidersService
   * @param policyEnrollmentTransformBeneficiaryService
   * @param policyEnrollmentTransformOtherInsuranceService
   * @param policyEnrollmentTransformConsentsService
   * @param policyEnrollmentTransformPaymentDetailsService
   */
  constructor(
    private auth: AuthService,
    private agentService: AgentService,
    private translationService: TranslationService,
    private formBuilder: FormBuilder,
    private commonService: CommonService,
    private policyEnrollmentTransformService: PolicyEnrollmentTransformMembersService,
    private policyEnrollmentTransformPetitionerService: PolicyEnrollmentTransformPetitionerService,
    private medicalQuestionsTransformService: MedicalQuestionsTransformService,
    private policyEnrollmentTransformOwnerPetitionerService: PolicyEnrollmentTransformOwnerPetitionerService,
    private policyEnrollmentTransformOwnerService: PolicyEnrollmentTransformOwnerService,
    private policyEnrollmentTransformProductPlanRidersService: PolicyEnrollmentTransformProductPlanRidersService,
    private policyEnrollmentTransformBeneficiaryService: PolicyEnrollmentTransformBeneficiaryService,
    private policyEnrollmentTransformOtherInsuranceService: PolicyEnrollmentTransformOtherInsuranceService,
    private policyEnrollmentTransformConsentsService: PolicyEnrollmentTransformConsentsService,
    private policyEnrollmentTransformPaymentDetailsService: PolicyEnrollmentTransformPaymentDetailsService,
    private policyEnrollmentTransformOwnerServicePan: TransformOwnerService,
    private transformConsentsService: TransformConsentsService,
    private transformPetitionerService: TransformPetitionerService,
    private uploadService: UploadService) {
    this.policyEnrollmentSubject = new Subject<PolicyEnrollmentWizard>();
  }
  getPolicyEnrollment() {
    return this.policyEnrollment;
  }

  getPolicyEnrollmentWithSetCurrentStep(viewTemplate?: any, step?: number, currentSection?: number) {
    if (viewTemplate) {
      this.policyEnrollment.viewTemplate = viewTemplate;
    }
    if (step) {
      this.policyEnrollment.currentStep = step;
    }

    if (currentSection) {
      this.policyEnrollment.currentSection = currentSection;
    }

    return this.policyEnrollment;
  }

  beginPolicyEnrollmentWizard(fn, user, viewTemplate?, step?: number,
    currentSection?: number, policyAppDto?: PolicyApplicationResponse): Subscription {
    const subscription = this.policyEnrollmentSubject.subscribe(fn);
    if (!this.policyEnrollment) {
      this.newPolicyEnrollment(user, viewTemplate, policyAppDto);
    }

    if (policyAppDto) {
      const returnedObject = Object.assign({}, policyAppDto.policyApplications[0]);
      this.policyEnrollment.policyApplicationModel = JSON.parse(JSON.stringify(returnedObject));
    }

    if (viewTemplate) {
      this.policyEnrollment.viewTemplate = viewTemplate;
    }
    if (step) {
      this.policyEnrollment.currentStep = step;
    }

    if (currentSection) {
      this.policyEnrollment.currentSection = currentSection;
    }
    this.next();
    return subscription;
  }

  checkIfPolicyHasError(policyAdd) {

  }

  /**
 * News policy enrollment
 * @param user
 * @param viewTemplate
 */
  private newPolicyEnrollment(user, viewTemplate, policyAppDto?) {
    this.policyEnrollment = {
      currentStep: this.INITIAL_VALUE_ZERO,
      currentSection: this.INITIAL_VALUE_ZERO,
      user: user,
      agent: null,
      viewTemplate: viewTemplate,
      languageId: this.INITIAL_VALUE_ZERO,
      language: this.INITIAL_VALUE_EMPTY,
      policyApplicationGuid: this.INITIAL_VALUE_EMPTY,
      policyApplicationModel: null,
      listMaritalStatus$: this.commonService.getMaritalstatus(),
      countries$: this.commonService.getCountries(),
      cities$: null,
      relationCustomer: [],
      sourceOfFunding$: this.commonService.getSourceOffunding(),
      genders$: this.commonService.getGenders(),
      areaCodes$: null,
      coloniesHome$: null,
      coloniesPostal$: null,
      localityPostal$: null,
      localityHome$: null,
      municipality$: null,
      industries$: this.commonService.getIndustries(),
      enrollmentForm: this.formBuilder.group({}),
      addressGuid: this.INITIAL_VALUE_EMPTY,
      emailGuid: this.INITIAL_VALUE_EMPTY,
      ownerMemberGuid: this.INITIAL_VALUE_EMPTY,
      phoneGuid: this.INITIAL_VALUE_EMPTY,
      statusGuid: this.INITIAL_VALUE_EMPTY,
      diffAddressHomeMail: false,
      addressPostalGuid: this.INITIAL_VALUE_EMPTY,
      applicationIdentificationCURPGuid: this.INITIAL_VALUE_EMPTY,
      applicationIdentificationSNGuid: this.INITIAL_VALUE_EMPTY,
      applicationIdentificationRUPGuid: this.INITIAL_VALUE_EMPTY,
      applicationGuids: this.INIT_VALUE_ARRAY,
      beneficiaryGuid: this.INITIAL_VALUE_EMPTY,
      contactGuid: this.INITIAL_VALUE_EMPTY,
      beneficiaryCellPhoneNumberGuid: this.INITIAL_VALUE_EMPTY,
      beneficiaryPhoneNumberGuid: this.INITIAL_VALUE_EMPTY,
      beneficiaryAddressGuid: this.INITIAL_VALUE_EMPTY,
      otherInsuranceGuid: this.INITIAL_VALUE_EMPTY,
      isCurrentSectionValid: true,
      isHomeVisible: true,
      documentsFolderName: this.INITIAL_VALUE_EMPTY,
      rulesSelected: [],
      emailOnlineGuid: this.INITIAL_VALUE_EMPTY,
      applicationIdentificationDocGuid: this.INITIAL_VALUE_EMPTY,
      emailOtherGuid: this.INITIAL_VALUE_EMPTY,
      phone1001Guid: this.INITIAL_VALUE_EMPTY,
      otherAddressGuid: this.INITIAL_VALUE_EMPTY,
      applicationIdentificationDepGuid: this.INITIAL_VALUE_EMPTY,
      dependentNumberAndExtensionGuid: this.INITIAL_VALUE_EMPTY,
      beneficiaryIdentificationGuid: this.INITIAL_VALUE_EMPTY,
      agreementDefintion$: this.commonService.getAgreementsDefByBusinessId(+user.bupa_insurance),
      beneficiaryEmailGuid: this.INITIAL_VALUE_EMPTY
    };
    this.initializePolicyEnrollmentData(policyAppDto);
  }

  /**
 * Initializes policy enrollment data
 */
  private initializePolicyEnrollmentData(policyAppDto: PolicyApplicationResponse) {
    if (this.policyEnrollment) {
      this.agentService.getAgentById(this.policyEnrollment.user.agent_number).subscribe(agent => {
        this.policyEnrollment.agent = agent;
        this.policyEnrollment.policyApplicationModel = this.createPolicyApplicationModelDefault(policyAppDto);
        this.policyEnrollment.languageId = this.translationService.getLanguageId();
        this.policyEnrollment.language = this.translationService.getLanguageName();
      });
    }
  }

  /**
 * Creates policy application model default
 * @returns policy application model default
 */
  private createPolicyApplicationModelDefault(policyAppDto: PolicyApplicationResponse): PolicyApplicationModel {
    this.getNewGuidDefault();
    return this.getPolicyAppModelFromDto(policyAppDto);
  }

  getPolicyAppModelFromDto(policyAppDto: PolicyApplicationResponse): PolicyApplicationModel {
    if (policyAppDto) {
      const returnedObject = Object.assign({}, policyAppDto.policyApplications[0]);
      return JSON.parse(JSON.stringify(returnedObject));
    } else {
      const policyAppModel = {
        applicationGuid: this.INITIAL_VALUE_EMPTY,
        applicationId: this.INITIAL_VALUE_ZERO,
        agentId: this.policyEnrollment.agent.agentId,
        agent: this.agentService.getAgentName(this.policyEnrollment.agent),
        policyId: this.INITIAL_VALUE_EMPTY,
        process: 'ElectronicApplication',
        enrollmentTypeId: 1,
        enrollmentType: 'Application',
        requestorFirstName: this.getRequestorInformationFromUser('first_name', this.policyEnrollment.user),
        requestorLastName: this.getRequestorInformationFromUser('last_name', this.policyEnrollment.user),
        requestorTypeId: this.getRequestorInformationFromUser('type_id', this.policyEnrollment.user),
        requestorType: this.getRequestorInformationFromUser('type', this.policyEnrollment.user),
        requestorEmail: this.getRequestorInformationFromUser('email', this.policyEnrollment.user),
        requestorPhone: this.getRequestorInformationFromUser('phone', this.policyEnrollment.user),
        issueDate: null,
        signedDate: null,
        stampDate: null,
        countryId: this.INITIAL_VALUE_ZERO,
        country: this.INITIAL_VALUE_EMPTY,
        cityId: this.INITIAL_VALUE_ZERO,
        city: this.INITIAL_VALUE_EMPTY,
        productId: this.INITIAL_VALUE_ZERO,
        product: this.INITIAL_VALUE_EMPTY,
        planId: this.INITIAL_VALUE_ZERO,
        plan: this.INITIAL_VALUE_EMPTY,
        insuranceBusinessId: this.policyEnrollment.agent.insuranceBusinessId,
        insuranceBusiness: this.policyEnrollment.agent.insuranceBusiness,
        businessModeId: 1,
        businessMode: 'Health_Individual',
        receivedMethodId: 5,
        receiveMethod: 'Online',
        languageId: this.policyEnrollment.languageId,
        language: this.policyEnrollment.language,
        modeOfPaymentId: 1,
        modeOfPayment: '_unknown',
        paymentMethodId: 5,
        paymentMethod: '_unknown',
        updatedBy: this.policyEnrollment.user.name,
        updatedOn: null,
        status: 'Pending Information',
        createdOn: Utilities.getDateNow(),
        daysElapsed: this.INITIAL_VALUE_ZERO,
        addresses: [],
        phones: [],
        emails: [],
        members: [],
        riders: [],
        petitioner: null,
        documents: [],
        paperless: false,
        petitionerTypeId: this.INITIAL_VALUE_ZERO,
        identifications: [],
        viewTemplateId: 0,
        beneficiary: null,
        agreements: [],
        promoterKey: null,
        promoterEmail: null,
        otherInsurance: null,
        medicalQuestion: [],
        medicalHistory: [],
        creditCard: null,
        rules: []
      };
      return policyAppModel;
    }
  }

  buildStep(step: number): FormGroup {
    const formStep = this.formBuilder.group({});
    if (this.policyEnrollment.viewTemplate) {
      const viewTemplateStep = this.policyEnrollment.viewTemplate.steps.find(s => s.stepNumber === step);
      viewTemplateStep.sections.forEach(section => {
        formStep.addControl(section.name, this.formBuilder.group({}));
        section.controls.forEach(control => {
          ((formStep.get(section.name) as FormGroup)).addControl(control.key, this.buildControl(control));
        });
      });
    }
    return formStep;
  }

  buildSection(step: number, sectionId: number): FormGroup {
    const formSection = this.formBuilder.group({});
    if (this.policyEnrollment.viewTemplate) {
      const viewTemplateStep = this.policyEnrollment.viewTemplate.steps.find(s => s.stepNumber === step);
      const section = viewTemplateStep.sections.find(s => s.id === sectionId);
      section.controls.forEach(control => {
        formSection.addControl(control.key, this.buildControl(control));
      });
    }
    return formSection;
  }
  /**
   * Schedules new guid
   */
  public scheduleNewGuid() {
    this.commonService.newGuid(g => {
      this.policyEnrollment.applicationGuids.push(g);
    });
  }
  /**
   * Gets new guid
   * @returns new guid
   */
  public getNewGuid(): string {
    if (this.policyEnrollment.applicationGuids.length > 0) {
      const guidToReturn = this.policyEnrollment.applicationGuids[this.policyEnrollment.applicationGuids.length - 1];
      this.policyEnrollment.applicationGuids.splice(this.policyEnrollment.applicationGuids.indexOf(guidToReturn), 1);
      return guidToReturn;
    }
    return '';
  }

  buildControl(control: Control): FormControl {
    const formControl = this.formBuilder.control('');
    const validatorsArray = [];
    control.validators.forEach(
      validator => {
        switch (validator.key) {
          case 'required': {
            if (validator.value) {
              validatorsArray.push(Validators.required);
            }
            break;
          }
          case 'maxLength': {
            if (validator.value) {
              validatorsArray.push(Validators.maxLength(+validator.value));
            }
            break;
          }
          case 'minLength': {
            if (validator.value) {
              validatorsArray.push(Validators.minLength(+validator.value));
            }
            break;
          }
          case 'min': {
            if (validator.value) {
              validatorsArray.push(Validators.min(+validator.value));
            }
            break;
          }
          case 'max': {
            if (validator.value) {
              validatorsArray.push(Validators.max(+validator.value));
            }
            break;
          }
          case 'insuranceCoverageDate': {
            if (validator.value) {
              validatorsArray.push(CustomValidator.insuranceCoverageDate);
            }
            break;
          }
          case 'dateValueRange': {
            if (validator.value) {
              validatorsArray.push(CustomValidator.dateValueRange);
            }
            break;
          }
          case 'ageRangePolicy': {
            if (validator.value) {
              validatorsArray.push(CustomValidator.ageRangePolicy);
            }
            break;
          }
          case 'emailPatternValidator': {
            if (validator.value) {
              validatorsArray.push(CustomValidator.emailPatternValidator);
            }
            break;
          }
          case 'isAnAdultAge': {
            if (validator.value) {
              validatorsArray.push(CustomValidator.isAnAdultAge);
            }
            break;
          }
          case 'pattern': {
            if (validator.value) {
              validatorsArray.push(Validators.pattern(validator.value.toString()));
            }
            break;
          }
          default: {
            break;
          }
        }
      }
    );
    if (validatorsArray.length > 0) {
      formControl.setValidators(validatorsArray);
    }
    if (control.enable) {
      formControl.enable();
    } else { formControl.disable(); }
    return formControl;
  }

  getConfigStep(step: number): ViewTemplateStep {
    if (this.policyEnrollment.viewTemplate) {
      return this.policyEnrollment.viewTemplate.steps.find(s => s.stepNumber === step);
    } else {
      return null;
    }
  }

  /***
   * Get value from validator
   */
  getValidatorValue(section: Section, controlName: string, validator: string) {
    const validatorJson = (section.controls.
      find(x => x.key === controlName).validators.
      find(y => y.key === validator));
    if (validatorJson) {
      return validatorJson.value;
    } else {
      return null;
    }
  }

  /***
   * Get message from validator
   */
  getMessageValidator(section: Section, controlName: string, validator: string) {
    return section.controls.
      find(x => x.key === controlName).validators.
      find(y => y.key === validator).keyMessage;
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

  endPolicyEnrollmentWizard(user) {
    this.newPolicyEnrollment(user, null);
    this.uploadService.removeAllDocuments();
    this.next();
  }
  /**
   * Gets new guid default
   */
  private getNewGuidDefault() {
    this.commonService.newGuid(g => this.policyEnrollment.policyApplicationGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.ownerMemberGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.phoneGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.emailGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.emailOnlineGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.addressGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.statusGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.addressPostalGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.applicationIdentificationCURPGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.applicationIdentificationRUPGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.applicationIdentificationSNGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.applicationIdentificationDepGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.beneficiaryGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.contactGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.beneficiaryPhoneNumberGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.beneficiaryCellPhoneNumberGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.beneficiaryAddressGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.otherInsuranceGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.applicationIdentificationDocGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.phone1001Guid = g);
    this.commonService.newGuid(g => this.policyEnrollment.emailOtherGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.otherAddressGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.beneficiaryIdentificationGuid = g);
    this.commonService.newGuid(g => this.policyEnrollment.beneficiaryEmailGuid = g);
  }

  /**
   * Builds policy application
   * @param [documents]
   */
  async buildPolicyApplication(documents?: any) {
    this.policyEnrollment.policyApplicationModel.languageId = this.translationService.getLanguageId();
    this.policyEnrollment.policyApplicationModel.language = this.translationService.getLanguageName();
    this.policyEnrollment.policyApplicationModel.viewTemplateId = this.policyEnrollment.viewTemplate.viewTemplateId;
    if (!this.policyEnrollment.policyApplicationModel.applicationGuid) {
      this.policyEnrollment.policyApplicationModel.applicationGuid = this.policyEnrollment.policyApplicationGuid;
    }

    if (+this.policyEnrollment.user.bupa_insurance === InsuranceBusiness.BUPA_MEXICO) {
      await this.buildPolicyApplicationMX(documents);
    }

    if (+this.policyEnrollment.user.bupa_insurance === InsuranceBusiness.BUPA_PANAMA) {
      await this.buildPolicyApplicationPAN(documents);
    }

  }

  /**
   * Builds policy application mx
   * @param [documents]
   */
  async buildPolicyApplicationMX(documents?: any) {
    switch (this.policyEnrollment.currentStep) {
      case 2: {
        this.transformPolicyApplicationModelOwner();
        break;
      }

      case 3: {
        this.transformPolicyApplicationModelMember();
        break;
      }

      case 4: {
        await this.transformPolicyApplicationModelMedicalQuestionnaires();
        break;
      }

      case 5: {
        this.transformPolicyApplicationModelProductPlanRiders();
        break;
      }

      case 6: {
        this.transformPolicyApplicationModelBeneficiary();
        break;
      }

      case 7: {
        this.transformPolicyApplicationModelOtherInsurance();
        break;
      }

      case 8: {
        this.transformPolicyApplicationModelConsents();
        break;
      }

      case 9: {
        this.transformPolicyApplicationModelPaymentDetail();
        break;
      }

      case 10: {
        this.transformPolicyApplicationModelPetitioner();
        break;
      }
      case 11: {
        await this.transformPolicyApplicationModelAttachments(documents);
        break;
      }
    }
  }

  /**
   * Transforms policy application model owner
   */
  private transformPolicyApplicationModelOwner() {
    this.policyEnrollmentTransformOwnerService.transformDataFormToModel(this.policyEnrollment);
  }

  /**
 * Transforms policy application model owner
 */
  private transformPolicyApplicationModelOwnerPan() {
    this.policyEnrollmentTransformOwnerServicePan.transformDataFormToModel(this.policyEnrollment);
  }
  /**
   * Transforms policy application model member
   */
  private transformPolicyApplicationModelMember() {
    this.policyEnrollmentTransformService.createMembers(
      (this.policyEnrollment.enrollmentForm.get('policyApplicationDependents').get('items') as FormArray),
      this.policyEnrollment.policyApplicationModel);
  }

  /**
   * Transforms policy application model medical questionnaires
   */
  async transformPolicyApplicationModelMedicalQuestionnaires() {
    await this.medicalQuestionsTransformService.transformPolicyApplicationModelMedicalQuestionnaires(this.policyEnrollment.currentSection,
      this.policyEnrollment.enrollmentForm, this.policyEnrollment.policyApplicationModel);
  }

  /**
   * Transforms policy application model product plan riders
   */
  private transformPolicyApplicationModelProductPlanRiders() {
    this.policyEnrollmentTransformProductPlanRidersService.transformDataFormToModel(this.policyEnrollment);
  }

  /**
  * Transforms policy application model beneficiary
  */
  private transformPolicyApplicationModelBeneficiary() {
    this.policyEnrollmentTransformBeneficiaryService.transformDataFormToModel(this.policyEnrollment);
  }

  /**
 * Transforms policy application model other insurance
 */
  private transformPolicyApplicationModelOtherInsurance() {
    this.policyEnrollmentTransformOtherInsuranceService.transformDataFormToModel(this.policyEnrollment);
  }

  /**
 * Transforms policy application model consents
 */
  private transformPolicyApplicationModelConsents() {
    this.policyEnrollmentTransformConsentsService.transformDataFormToModel(this.policyEnrollment);
  }

  private transformPolicyApplicationModelPaymentDetail() {
    this.policyEnrollmentTransformPaymentDetailsService.transformDataFormToModel(this.policyEnrollment);

  }

  private transformPolicyApplicationModelPetitioner() {
    if (this.policyEnrollment.policyApplicationModel.petitionerTypeId === PetitionerType.POLICY_HOLDER) {
      this.policyEnrollmentTransformOwnerPetitionerService.createPetitioner(
        this.policyEnrollment.enrollmentForm.get('policyApplicationPetitioner') as FormGroup,
        this.policyEnrollment.policyApplicationModel);
    } else {
      this.policyEnrollmentTransformPetitionerService.createPetitioner(
        this.policyEnrollment.enrollmentForm.get('policyApplicationPetitioner') as FormGroup,
        this.policyEnrollment.policyApplicationModel
      );
    }
  }

  private async transformPolicyApplicationModelAttachments(documents?: any) {
    await this.enrichPolicyApplicationModelWithDocuments(documents, this.policyEnrollment.documentsFolderName);
  }

  public async enrichPolicyApplicationModelWithDocuments(documents?: any, folderName?: string) {
    if (documents) {
      for (const fileDocument of documents) {
        this.policyEnrollment.policyApplicationModel.documents.push(
          {
            applicationDocumentGuid: await this.commonService.newGuidNuevo().toPromise(),
            applicationGuid: this.policyEnrollment.policyApplicationModel.applicationGuid,
            documentName: folderName + '\\' + fileDocument.file.name,
            applicationDocumentTypeId: fileDocument.category
          }
        );
      }
    }
  }

  /**
 * Builds policy application mx
 * @param [documents]
 */
  async buildPolicyApplicationPAN(documents?: any) {
    switch (this.policyEnrollment.currentStep) {
      case 2: {
        this.transformPolicyApplicationModelOwnerPan();
        break;
      }

      case 3: {
        this.transformPolicyApplicationModelMember();
        break;
      }

      case 4: {
        await this.transformPolicyApplicationModelMedicalQuestionnaires();
        break;
      }

      case 5: {
        this.transformPolicyApplicationModelProductPlanRiders();
        break;
      }

      case 6: {
        this.transformPolicyApplicationModelBeneficiary();
        break;
      }

      case 7: {
        this.transformPolicyApplicationModelOtherInsurance();
        break;
      }

      case 8: {
        await this.transformPolicyApplicationModelConsentsPAN();
        break;
      }

      case 9: {
        this.transformPolicyApplicationModelPetitionerPAN();
        break;
      }

      case 11: {
        await this.transformPolicyApplicationModelAttachments(documents);
        break;
      }
    }
  }

  /**
* Transforms policy application model consents
*/
  private async transformPolicyApplicationModelConsentsPAN() {
    await this.transformConsentsService.transformDataFormToModel(this.policyEnrollment);
  }

  private transformPolicyApplicationModelPetitionerPAN() {
    // await this.transformPetitionerService.assignGuids(this.policyEnrollment.policyApplicationModel);
    this.transformPetitionerService.createPetitioner(
      this.policyEnrollment.enrollmentForm.get('policyAppInfoPetitioner') as FormGroup,
      this.policyEnrollment.policyApplicationModel);
  }

  getBoolFromString(value: any) {
    return value === 'true' ? true : false;
  }

  private next() {
    this.policyEnrollmentSubject.next(this.policyEnrollment);
  }

  /**
  * Get requestor information according agent (company, person) and if is impersonalized
  * @param field field
  * @param user user
  */
  private getRequestorInformationFromUser(field, user) {
    const isImpersonalized = this.auth.isImpersonalized();
    switch (field) {
      case 'first_name':
        return (isImpersonalized ? user.user_impersonalizes_name :
          (this.policyEnrollment.agent.companyName === ''
            ? `${this.policyEnrollment.agent.firstName} ${this.policyEnrollment.agent.middleName}`
            : this.policyEnrollment.agent.companyName));
      case 'last_name':
        return (isImpersonalized ? user.user_impersonalizes_given_name :
          (this.policyEnrollment.agent.companyName === '' ? this.policyEnrollment.agent.lastName
            : this.policyEnrollment.agent.companyName));
      case 'type_id':
        return (isImpersonalized ? user.user_impersonalizes_role_id : user.role_id);
      case 'type':
        return (isImpersonalized ? user.user_impersonalizes_role : user.role);
      case 'email':
        return (isImpersonalized ? user.user_impersonalizes_user_id :
          this.policyEnrollment.agent.emails.filter(
            email => email.emailTypeId === this.PREFERRED_EMAIL)[0].eMailAddress);
      case 'phone':
        return (isImpersonalized ? '' :
          this.policyEnrollment.agent.phones.filter(
            phone => phone.phoneTypeId === PhoneTypes.OFFICE)[0].phoneNumber);
      default:
        return '';
    }
  }

  /**
   * Get nested form controls.
   */
  public getControl(step: string, section: string, field: string): FormControl {
    return this.policyEnrollment.enrollmentForm.get(step).get(section).get(field) as FormControl;
  }

  /**
* Get Country Id from Owner.
* @returns CountryId from Owner.
*/
  public getCountryIdFromOwner(): number {
    if (this.policyEnrollment && this.policyEnrollment.policyApplicationModel) {
      const member: Member = this.policyEnrollment.policyApplicationModel.members
        .find(memberFind => memberFind.relationTypeId === RelationType.OWNER);
      if (member) {
        const address: Address = this.policyEnrollment.policyApplicationModel.addresses
          .find(addressInFind => addressInFind.contactGuid === member.applicationMemberGuid
            && addressInFind.contactType === ContactTypes.MEMBER
            && addressInFind.addressTypeId === AddressTypes.PHYSICAL);
        if (address) {
          return address.countryId;
        }
      }
    }
    return 0;
  }

  /**
 * Get Country Id from Owner.
 * @returns City from Owner.
 */
  public getCityIdFromOwner(): number {
    if (this.policyEnrollment && this.policyEnrollment.policyApplicationModel) {
      const member: Member = this.policyEnrollment.policyApplicationModel.members
        .find(memberFind => memberFind.relationTypeId === RelationType.OWNER);
      if (member) {
        const address: Address = this.policyEnrollment.policyApplicationModel.addresses
          .find(addressInFind => addressInFind.contactGuid === member.applicationMemberGuid
            && addressInFind.contactType === ContactTypes.MEMBER
            && addressInFind.addressTypeId === AddressTypes.PHYSICAL);
        if (address) {
          return address.cityId;
        }
      }
    }
    return 0;
  }

  /**
   * Determines whether control is visible
   * @param stepNumber
   * @param sectionId
   * @param controlName
   * @returns true if control visible
   */
  isControlVisible(stepNumber: number, sectionId: number, controlName: string): boolean {
    return this.policyEnrollment.viewTemplate.steps
      .find(st => st.stepNumber === stepNumber).sections
      .find(s => s.id === sectionId).controls
      .find(c => c.key === controlName).visible;
  }
}
