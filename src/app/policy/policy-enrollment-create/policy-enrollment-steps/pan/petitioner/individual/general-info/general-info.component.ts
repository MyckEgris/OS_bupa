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
// tslint:disable-next-line: max-line-length
import { ManageIdentificationTypesService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/manage-identification-types.service';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Person } from 'src/app/shared/services/policy-application/entities/person';
import { PetitionerType } from 'src/app/shared/classes/petitioner-type.enum';
import { Identification as IdentificationPolicy } from 'src/app/shared/services/policy-application/entities/identification';
import * as moment from 'moment';
import { PetitionerExtension } from 'src/app/shared/services/policy-application/entities/petitioner-extension';
@Component({
  selector: 'app-general-info',
  templateUrl: './general-info.component.html'
})
export class GeneralInfoComponent implements OnInit, OnDestroy {
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
  SECTION_NAME = 'policyApplicationPetitionerIndividualGralInfo';
    /**
   * Authenticated User Object
   */
  user: UserInformationModel;

  /**
   * Const to identify the current Step
   */
  CURRENT_STEP = 9;
  CURRENT_SECTION_ID = 2;
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
  constructor(private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private manageIdentificationTypesService: ManageIdentificationTypesService,
    private translate: TranslateService,
    private notification: NotificationService,
    private router: Router,
    private policyApplicationService: PolicyApplicationService,
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
        this.getIdentifications();
      },
    this.user, null, this.CURRENT_STEP, this.CURRENT_SECTION_ID);
  }

  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.CURRENT_STEP);
    this.currentSection = this.configStep.sections.find(s => s.id === this.CURRENT_SECTION_ID);
    this.wizard.enrollmentForm.addControl(this.configStep.type, new FormGroup({}));
    (this.wizard.enrollmentForm.get(this.configStep.type) as FormGroup)
      .addControl(this.configStep.sections.find(s => s.id === this.CURRENT_SECTION_ID).name,
        this.policyEnrollmentWizardService.buildSection(this.CURRENT_STEP, this.CURRENT_SECTION_ID));
        this.setDefaultValuesCountries();
    if (localStorage.getItem('mode') === 'Edit') {
      this.setValuesToFormEdit();
    }
  }

  async getIdentifications() {
    this.identificationsTypes = await this.manageIdentificationTypesService
      .getIdentificationsByBusinessHolder(+this.user.bupa_insurance);
  }

  setValuesToFormEdit() {
    if (this.wizard.policyApplicationModel.petitioner && this.wizard.policyApplicationModel.petitioner.person) {
      const individual: Person = this.wizard.policyApplicationModel.petitioner.person;
      if (individual) {
        this.f.firstName.setValue(individual.firstName);
        this.f.middleName.setValue(individual.middleName);
        this.f.lastName.setValue(individual.lastName);
        this.f.secondSurname.setValue(individual.maternalLastName);
        this.f.petitionerDob.setValue(moment(individual.dob).toDate());
        this.f.countryOfBirth.setValue(individual.countryOfBirthId);
        this.f.nationality.setValue(individual.nationalityId);
        this.f.gender.setValue(individual.genderId);
        this.f.countryOfResidency.setValue(individual.petitionerExtension.countryResidencyId);
        this.f.maritalStatus.setValue(individual.petitionerExtension.maritalStatusId);
      }

      const identification: IdentificationPolicy = this.wizard.policyApplicationModel.petitioner.identifications
      .find(x => x.contactGuid === this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid);

      if (identification) {
        this.f.identificationType.setValue(identification.identificationTypeId);
        this.f.identificationNumber.setValue(identification.identificationNumber);
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
    await this.createGralInfo();
    this.wizard.policyApplicationModel.petitionerTypeId = PetitionerType.INDIVIDUAL;
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


  async createGralInfo() {
    if (this.wizard.policyApplicationModel.petitioner
      && this.wizard.policyApplicationModel.petitioner.person) {
      const identIndex = this.wizard.policyApplicationModel.petitioner.identifications.findIndex(x => x.contactGuid ===
        this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid);

      this.wizard.policyApplicationModel.petitioner.identifications[identIndex] =
        this.createOrUpdateIdentifications(
          this.wizard.policyApplicationModel.petitioner.identifications[identIndex].applicationIdentificationGuid,
          this.wizard.policyApplicationModel.applicationGuid,
          this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid);

      const extension: PetitionerExtension = this.createOrUpdateExtension(
        this.wizard.policyApplicationModel.petitioner.person.petitionerExtension.averageAnnualIncome,
        this.wizard.policyApplicationModel.petitioner.person.petitionerExtension.placeWherePayTaxes,
        this.wizard.policyApplicationModel.petitioner.person.petitionerExtension.isUsResident,
        this.wizard.policyApplicationModel.petitioner.person.petitionerExtension.isPEP,
        this.wizard.policyApplicationModel.petitioner.person.petitionerExtension.relationshipPEP,
        this.wizard.policyApplicationModel.petitioner.person.petitionerExtension.associatedPEP,
        this.wizard.policyApplicationModel.petitioner.person.petitionerExtension.workPlace,
        this.wizard.policyApplicationModel.petitioner.person.petitionerExtension.performingJob,
        this.f.maritalStatus.value, this.f.countryOfResidency.value);

      this.wizard.policyApplicationModel.petitioner.person = this.createOrUpdateIndividual(
        this.wizard.policyApplicationModel.petitioner.person.applicationPersonPetitionerGuid,
        this.wizard.policyApplicationModel.petitioner.applicationPetitionerGuid, extension);

    } else {
      this.wizard.policyApplicationModel.petitioner = await this.createPetitionerInformation();
    }
  }

  async createPetitionerInformation() {
    const applicationPetitionerGuid: string = await this.commonService.newGuidNuevo().toPromise();
    const applicationPersonPetitionerGuid: string = await this.commonService.newGuidNuevo().toPromise();
    const applicationIdentificationGuid: string = await this.commonService.newGuidNuevo().toPromise();

    const extension: PetitionerExtension = this.createOrUpdateExtension(null, null, false, false, false, false, null, null,
      this.f.maritalStatus.value, this.f.countryOfResidency.value);

    const petitionerInformation = {
      applicationPetitionerGuid: applicationPetitionerGuid,
      applicationGuid: this.wizard.policyApplicationModel.applicationGuid,
      petitionerTypeId: PetitionerType.INDIVIDUAL,
      otherSourceOfFounding: '',
      company: null,
      person: this.createOrUpdateIndividual(applicationPersonPetitionerGuid, applicationPetitionerGuid, extension),
      petitionerType: PetitionerType.getDescription(PetitionerType.INDIVIDUAL),
      industry: '',
      sourceOfFunding: '',
      addresses: [],
      phones: [],
      emails: [],
      identifications: [this.createOrUpdateIdentifications(applicationIdentificationGuid,
        this.wizard.policyApplicationModel.applicationGuid, applicationPetitionerGuid)]
    };
    return petitionerInformation;
  }

  createOrUpdateIndividual(applicationPersonPetitionerGuid: string, applicationPetitionerGuid: string,
    petitionerExtension: PetitionerExtension) {
    const person: Person = {
      applicationPersonPetitionerGuid: applicationPersonPetitionerGuid,
      applicationPetitionerGuid: applicationPetitionerGuid,
      firstName: this.f.firstName.value,
      middleName: this.f.middleName.value,
      paternalLastName: this.f.lastName.value,
      maternalLastName: this.f.secondSurname.value,
      lastName: this.f.lastName.value,
      dob: this.f.petitionerDob.value,
      genderId: this.f.gender.value,
      patrimonialLinks: '',
      nationalityId: this.f.nationality.value,
      countryOfBirthId: this.f.countryOfBirth.value,
      petitionerExtension: petitionerExtension
    };
    return person;
  }

  createOrUpdateIdentifications(applicationIdentificationGuid: string, applicationGuid: string, contactGuid: string) {
    const identification: IdentificationPolicy  = {
      applicationIdentificationGuid: applicationIdentificationGuid,
      applicationGuid: applicationGuid,
      contactType: 0,
      contactGuid: contactGuid,
      identificationNumber: this.f.identificationNumber.value,
      identificationTypeId: this.f.identificationType.value
    };
    return identification;
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
   * Sets country of residency
   */
  private setDefaultCountryOfResidency(countryId: number) {
    if (!this.f.countryOfResidency.value) {
      this.f.countryOfResidency.setValue(countryId);
    }
  }

  /**
   * Sets default nationality
   */
  private setDefaultNationality(countryId: number) {
    if (!this.f.nationality.value) {
      this.f.nationality.setValue(countryId);
    }
  }

  /**
   * Sets default country of birth
   */
  private setDefaultCountryOfBirth(countryId: number) {
    if (!this.f.countryOfBirth.value) {
      this.f.countryOfBirth.setValue(countryId);
    }
  }

    /**
   * Sets default values countries
   * @param formControlName
   */
  private setDefaultValuesCountries() {
    this.wizard.countries$.subscribe(c => {
      if (c.find(i => i.isoAlpha === this.user.cc)) {
        this.setDefaultCountryOfResidency(c.find(i => i.isoAlpha === this.user.cc).countryId);
        this.setDefaultNationality(c.find(i => i.isoAlpha === this.user.cc).countryId);
        this.setDefaultCountryOfBirth(c.find(i => i.isoAlpha === this.user.cc).countryId);
      }
    });
  }

}
