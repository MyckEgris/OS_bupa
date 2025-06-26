import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { PolicyEnrollmentWizard } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Subscription } from 'rxjs';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentWizardService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { Identification } from 'src/app/shared/services/common/entities/Identification';
import { PetitionerType } from 'src/app/shared/classes/petitioner-type.enum';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PetitionerInformation } from 'src/app/shared/services/policy-application/entities/petitioner-information';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { PetitionerExtension } from 'src/app/shared/services/policy-application/entities/petitioner-extension';
import { Company } from 'src/app/shared/services/policy-application/entities/company';
import { CompanyContacts } from 'src/app/shared/services/policy-application/entities/company-contacts';
import { PetitionerConctactType } from 'src/app/shared/classes/petitioner-contact-type.enum';
import * as moment from 'moment';
@Component({
  selector: 'app-general-info-company',
  templateUrl: './general-info-company.component.html'
})
export class GeneralInfoCompanyComponent implements OnInit, OnDestroy {
    /***
   * Wizard Subscription
   */
  private subscription: Subscription;

  /**
   * Error saving title of policy enrollment step2 section3 component
   */
  private ERROR_SAVING_TITLE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_TITLE';
  /**
   * Error saving message of policy enrollment step2 section3 component
   */
  private ERROR_SAVING_MESSAGE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_MESSAGE';
  /**
   * Error saving ok of policy enrollment step2 section3 component
   */
  private ERROR_SAVING_OK = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_OK';
  STEP_NAME = 'policyAppInfoPetitioner';
  SECTION_NAME = 'policyApplicationCompanyGralInfo';

    /**
   * Authenticated User Object
   */
  user: UserInformationModel;

  /**
   * Const to identify the current Step
   */
  CURRENT_STEP = 9;
  CURRENT_SECTION_ID = 5;
  /**
   * PolicyEnrollment Wizard Step Configuration
   */
  configStep: ViewTemplateStep;

  /**
   * Number to identify the Section Active
   */
  sectionActive: number;

  /**
   * PolicyEnrollment Wizard Filtered Current Section
   */
  wizard: PolicyEnrollmentWizard;
  showValidations: boolean;
  /**
   * PolicyEnrollment Wizard Filtered Current Section
   */
  currentSection: Section;
  identificationsTypes: Array<Identification> = [];
  maxDate = new Date();
  constructor(private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private router: Router,
    private policyApplicationService: PolicyApplicationService,
    private translate: TranslateService,
    private notification: NotificationService,
    private commonService: CommonService) { }
  /**
   * Executed when the component is destroyed
   */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.setUpForm();
      },
      this.user, null, this.CURRENT_STEP, this.CURRENT_SECTION_ID);
      this.currentSection = this.configStep.sections.find(s => s.id === this.CURRENT_SECTION_ID);
  }

  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.CURRENT_STEP);
    this.wizard.enrollmentForm.addControl(this.configStep.type, new FormGroup({}));
    (this.wizard.enrollmentForm.get(this.configStep.type) as FormGroup)
      .addControl(this.configStep.sections.find(s => s.id === this.CURRENT_SECTION_ID).name,
        this.policyEnrollmentWizardService.buildSection(this.CURRENT_STEP, this.CURRENT_SECTION_ID));
    this.setDefaultPlaceWherePayTaxes();
    if (localStorage.getItem('mode') === 'Edit') {
      this.setValuesToFormEdit();
    }
  }

  setValuesToFormEdit() {
    if (this.wizard.policyApplicationModel.petitioner
      && this.wizard.policyApplicationModel.petitioner.company) {
      const company: Company = this.wizard.policyApplicationModel.petitioner.company;
      const companyContact: CompanyContacts[] = this.wizard.policyApplicationModel.petitioner.company.companyContacts;
      if (company && companyContact) {
        this.f.corporateName.setValue(company.companyName);
        this.f.constitutionDate.setValue(moment(company.constitution).toDate());
        this.f.occupationProfession.setValue(this.wizard.policyApplicationModel.petitioner.industryId);
        this.f.ruc.setValue(company.commercialNumber);
        this.f.firstName.setValue(companyContact[0].firstName);
        this.f.middleName.setValue(companyContact[0].middleName);
        this.f.lastName.setValue(companyContact[0].lastName);
        this.f.secondSurname.setValue(companyContact[0].paternalLastName);
        this.f.placeTaxed.setValue(company.petitionerExtension.placeWherePayTaxes);
        this.f.avgAnnualIncome.setValue(company.petitionerExtension.averageAnnualIncome);
      }
    }
  }

    /**
 * Gets form
 * @returns a form group
 */
  get currentFormGroup() {
    return  this.wizard.enrollmentForm
      .get(this.configStep.type)
      .get(this.configStep.sections
      .find(s => s.id === this.CURRENT_SECTION_ID).name) as FormGroup;
  }
      /**
   * Gets form controls
   */
  get f() {
    return (this.wizard.enrollmentForm.get(this.configStep.type).get(this.configStep.sections
      .find(s => s.id === this.CURRENT_SECTION_ID).name) as FormGroup).controls;
  }

    /**
   * Gets validator value
   * @param controlName
   * @param validator
   * @returns validators associated to form control from view template
   */
  getValidatorValue(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getValidatorValue(this.currentSection, controlName, validator);
  }
  /**
   * Gets validator message
   * @param controlName
   * @param validator
   * @returns the message associated to validator of a form control from view template
   */
  getValidatorMessage(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getMessageValidator(this.currentSection, controlName, validator);
  }

  next() {
    const isFormValid = (this.wizard.enrollmentForm.get(this.configStep.type)
      .get(this.configStep.sections.find(s => s.id === this.CURRENT_SECTION_ID).name) as FormControl);
    if (isFormValid.valid) {
      this.showValidations = false;
      this.createPolicyApplication();
    } else {
      this.showValidations = true;
    }
  }

  back() {
    this.router.navigate([this.currentSection.previousStep]);
  }

      /**
   * Creates policy application
   */
  async createPolicyApplication() {
    this.saveCheckpoint();
    await this.createGralInfoCompany();
    this.wizard.policyApplicationModel.petitionerTypeId = PetitionerType.COMPANY;
    this.policyApplicationService.createPolicyEnrollment(this.wizard.policyApplicationModel)
      .subscribe(
        p => {
          this.success(p);
        }, async e => {
          if (this.checkIfHasError(e)) {
            const errorMessage = this.ERROR_SAVING_MESSAGE;
            const title = await this.translate.get(this.ERROR_SAVING_TITLE).toPromise();
            const message = await this.translate.get(errorMessage).toPromise();
            const ok = await this.translate.get(this.ERROR_SAVING_OK).toPromise();
            const failed = await this.notification.showDialog(title, message, false, ok);
            if (failed) {
              return;
            }
          }
        },
      );
  }

  private saveCheckpoint() {
    const currentStepCompleted = JSON.parse(this.wizard.policyApplicationModel.currentStepCompleted);
    if (currentStepCompleted.stepNumber < this.CURRENT_STEP) {
      this.wizard.policyApplicationModel.currentStepCompleted =
        JSON.stringify(this.createCheckpoint(this.CURRENT_STEP, this.currentSection.id));
    }
  }

  private createCheckpoint(stepNumber: number, sectionId: number) {
    return {
      stepNumber: stepNumber,
      sectionId: sectionId
    };
  }

  async createGralInfoCompany() {
    if (this.wizard.policyApplicationModel.petitioner
      && this.wizard.policyApplicationModel.petitioner.company) {
        this.wizard.policyApplicationModel.petitioner.industryId = this.f.occupationProfession.value;

        this.wizard.policyApplicationModel.petitioner.company.petitionerExtension.averageAnnualIncome = this.f.avgAnnualIncome.value;
        this.wizard.policyApplicationModel.petitioner.company.petitionerExtension.placeWherePayTaxes = this.f.placeTaxed.value;

        this.wizard.policyApplicationModel.petitioner.company = this.createOrUpdateCompany(
          this.wizard.policyApplicationModel.petitioner.company.applicationCompanyPetitionerGuid,
          this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid,
          this.wizard.policyApplicationModel.petitioner.company.companyContacts[0].applicationCompanyPetitionerContactGuid,
          this.wizard.policyApplicationModel.petitioner.company.petitionerExtension
        );
    } else {
      this.wizard.policyApplicationModel.petitioner = await this.createPetitionerInformation();
    }
  }

  async createPetitionerInformation() {
    const applicationPetitionerGuid: string = await this.commonService.newGuidNuevo().toPromise();
    const applicationCompanyPetitionerGuid: string = await this.commonService.newGuidNuevo().toPromise();
    const applicationCompanyPetitionerContactGuid: string = await this.commonService.newGuidNuevo().toPromise();
    const extension = this.createOrUpdateExtension(this.f.avgAnnualIncome.value, this.f.placeTaxed.value,
      false, false, false, false, null, null, null, null);
    const petitionerInformation: PetitionerInformation = {
      applicationPetitionerGuid: applicationPetitionerGuid,
      applicationGuid: this.wizard.policyApplicationModel.applicationGuid,
      petitionerTypeId: PetitionerType.COMPANY,
      industryId: this.f.occupationProfession.value,
      otherSourceOfFounding: '',
      company: this.createOrUpdateCompany(applicationCompanyPetitionerGuid, applicationPetitionerGuid,
        applicationCompanyPetitionerContactGuid, extension),
      person: null,
      petitionerType: PetitionerType.getDescription(PetitionerType.COMPANY),
      industry: '',
      sourceOfFunding: '',
      addresses: [],
      phones: [],
      emails: [],
      identifications: []
    };
    return petitionerInformation;
  }

  createOrUpdateCompany(applicationCompanyPetitionerGuid: string, applicationPetitionerGuid: string,
    applicationCompanyPetitionerContactGuid: string, petitionerExtension: PetitionerExtension) {
      const company: Company = {
        applicationCompanyPetitionerGuid: applicationCompanyPetitionerGuid,
        applicationPetitionerGuid: applicationPetitionerGuid,
        companyName: this.f.corporateName.value,
        constitution: this.f.constitutionDate.value,
        commercialNumber: this.f.ruc.value,
        nationalityId: null,
        companyContacts: [this.createOrUpdateCompanyContact(applicationCompanyPetitionerContactGuid, applicationCompanyPetitionerGuid)],
        isContractor: 'false',
        petitionerExtension: petitionerExtension
      };
      return company;
  }

  createOrUpdateExtension(averageAnnualIncome: string,
    placeWherePayTaxes: string,
    isUsResident: boolean,
    isPEP: boolean,
    relationshipPEP: boolean,
    associatedPEP: boolean,
    workPlace: string,
    performingJob: string,
    maritalStatusId: number,
    countryResidencyId: number): PetitionerExtension {
    const extension: PetitionerExtension = {
      averageAnnualIncome: averageAnnualIncome,
      placeWherePayTaxes: placeWherePayTaxes,
      isUsResident: isUsResident,
      isPEP: isPEP,
      relationshipPEP: relationshipPEP,
      associatedPEP: associatedPEP,
      workPlace: workPlace,
      performingJob: performingJob,
      maritalStatusId: maritalStatusId,
      countryResidencyId: countryResidencyId
    };
    return extension;
  }

  createOrUpdateCompanyContact(applicationCompanyPetitionerContactGuid: string,
    applicationCompanyPetitionerGuid: string) {
    const companyContact: CompanyContacts = {
      applicationCompanyPetitionerContactGuid: applicationCompanyPetitionerContactGuid,
      applicationCompanyPetitionerGuid: applicationCompanyPetitionerGuid,
      firstName: this.f.firstName.value,
      middleName: this.f.middleName.value,
      paternalLastName: this.f.lastName.value,
      maternalLastName: this.f.secondSurname.value,
      lastName: this.f.lastName.value,
      petitionerContactType: PetitionerConctactType.LEGAL_REPRESENTATIVE,
      stockPercentage: null,
      position: null,
      nationalityId: 0
    };
    return companyContact;
  }

  /**
   * Success policy enrollment step2 section3 component
   * @param policyApplicationOutput
   */
  async success(policyApplicationOutput: PolicyApplicationOutputDto) {
    this.wizard.policyApplicationModel.applicationId = policyApplicationOutput.applicationId;
    this.nextPage();
  }

  /**
  * Next page
  */
  nextPage() {
    this.router.navigate([this.currentSection.nextStep]);
  }

  /**
  * Checks if has error
  * @param error
  * @returns errors
  */
  checkIfHasError(error) {
    return (error.error);
  }

    /**
   * Sets default place where pay taxes
   * @param formControlName
   */
  setDefaultPlaceWherePayTaxes() {
    if (!this.f.placeTaxed.value) {
      this.wizard.countries$.subscribe(c => {
        if (c.find(i => i.isoAlpha === this.user.cc)) {
          this.f.placeTaxed.setValue(c.find(i => i.isoAlpha === this.user.cc).countryName);
        }
      });
    }
  }

}
