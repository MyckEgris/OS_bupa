import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Subscription } from 'rxjs';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { PetitionerType } from 'src/app/shared/classes/petitioner-type.enum';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PetitionerInformation } from 'src/app/shared/services/policy-application/entities/petitioner-information';
import { CommonService } from 'src/app/shared/services/common/common.service';
@Component({
  selector: 'app-petitioner',
  templateUrl: './petitioner.component.html'
})
export class PetitionerComponent implements OnInit, OnDestroy {

  /***
   * Wizard Subscription
   */
  private subscription: Subscription;
  private petitionerTypeSelected: any;
  private _totalSectionByPetitionerType: number;
  private CURRENT_SECTION_ID = 1;
  private TOTAL_SECTIONS_INDIVIDUAL = 3;
  private TOTAL_SECTIONS_COMPANY = 2;
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
  SECTION_NAME = 'policyApplicationPetitionerPrevalidation';
  /**
   * Authenticated User Object
   */
  user: UserInformationModel;

  /**
   * Const to identify the current Step
   */
  CURRENT_STEP = 9;

  /**
   * PolicyEnrollment Wizard Step Configuration
   */
  configStep: ViewTemplateStep;

  /**
   * Number to identify the Section Active
   */
  _sectionActive: number;

  /**
   * PolicyEnrollment Wizard Filtered Current Section
   */
  wizard: PolicyEnrollmentWizard;

  /**
   * PolicyEnrollment Wizard Filtered Current Section
   */
  currentSection: Section;

  petitionerType: any[];
  showValidations: boolean;
  /**
   *Creates an instance of PolicyEnrollmentStep9Component.
   * @param {PolicyEnrollmentWizardService} policyEnrollmentWizardService
   * @param {AuthService} authService
   * @param {CommonService} commonService
   * @param {Router} router
   * @param {FormBuilder} fb
   * @memberof PolicyEnrollmentStep9Component
   */
  constructor(private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private policyApplicationService: PolicyApplicationService,
    private router: Router,
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

  /**
   *Executed when the component is initiallized
   */
  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.setUpForm();
        this.setValues();
      },
      this.user, null, this.CURRENT_STEP, 0);
  }

  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.CURRENT_STEP);
    this.currentSection = this.configStep.sections.find(s => s.id === this.CURRENT_SECTION_ID);
    this.wizard.enrollmentForm.addControl(this.configStep.type, new FormGroup({}));
    (this.wizard.enrollmentForm.get(this.configStep.type) as FormGroup)
      .addControl(this.configStep.sections.find(s => s.id === this.CURRENT_SECTION_ID).name,
        this.policyEnrollmentWizardService.buildSection(this.CURRENT_STEP, this.CURRENT_SECTION_ID));
  }

  setValues() {
    this.createListPetitionerTypes();
    if (localStorage.getItem('mode') === 'Edit') {
      if (this.f.question.value === '') {
        if (this.wizard.policyApplicationModel.petitioner) {
          switch (this.wizard.policyApplicationModel.petitioner.petitionerTypeId) {
            case PetitionerType.POLICY_HOLDER:
              this.f.question.setValue('false');
              this.f.petitionerType.disable();
              break;
            case PetitionerType.INDIVIDUAL:
            case PetitionerType.COMPANY:
              this.f.question.setValue('true');
              this.f.petitionerType.setValue(this.wizard.policyApplicationModel.petitioner.petitionerTypeId);
              this.router.navigate(
                [`${this.currentSection.currentStep}/${this.wizard.policyApplicationModel.petitioner.petitionerTypeId}`]
              );
              break;
            default:
              console.log('No Applicable');
              break;
          }
        }
      } else  {
        this.setValuesWhenIsTrue();
      }
    } else {
      this.setValuesWhenIsTrue();
    }
  }

  setValuesWhenIsTrue() {
    if (this.f.question.value === 'true' && this.wizard.policyApplicationModel.petitioner
    && this.wizard.policyApplicationModel.petitionerTypeId
    && this.wizard.policyApplicationModel.petitionerTypeId !== PetitionerType.POLICY_HOLDER) {
    if (!this.petitionerTypeSelected) {
      this.f.petitionerType.setValue(this.wizard.policyApplicationModel.petitioner.petitionerTypeId);
      this.router.navigate(
        [`${this.currentSection.currentStep}/${this.wizard.policyApplicationModel.petitioner.petitionerTypeId}`]
      );
    } else {
      this.router.navigate(
        [`${this.currentSection.currentStep}/${this.petitionerTypeSelected.value}`]
      );
    }
  } else if (this.f.question.value === 'true' && this.f.petitionerType.value &&
    (this.f.petitionerType.value === PetitionerType.COMPANY || this.f.petitionerType.value === PetitionerType.INDIVIDUAL )) {
      this.router.navigate(
        [`${this.currentSection.currentStep}/${this.f.petitionerType.value}`]
      );
  }
}

  createListPetitionerTypes() {
    this.petitionerType = [
      {
        description: 'Persona Jurídica',
        value: 2
      },
      {
        description: 'Persona Natural',
        value: 3
      }
    ];
  }

  petitionerFilterChanged(petitionerTypeSelected: any) {
    this.petitionerTypeSelected = petitionerTypeSelected;
    this.sectionActive = 1;
    if (this.petitionerTypeSelected.value === PetitionerType.INDIVIDUAL) {
      this.totalSectionByPetitionerType = this.TOTAL_SECTIONS_INDIVIDUAL;
    } else {
      this.totalSectionByPetitionerType = this.TOTAL_SECTIONS_COMPANY;
    }
    this.router.navigate([`${this.currentSection.currentStep}/${petitionerTypeSelected.value}`]);
  }

  handleCheck(checked: string) {
    const isNotEqualToPolicyHolder = (checked === 'true') ? true : false;
    if (isNotEqualToPolicyHolder) {
      this.f.petitionerType.enable();
    } else {
      this.f.petitionerType.setValue('');
      this.f.petitionerType.disable();
      this.router.navigate([this.currentSection.currentStep]);
    }
  }

  async createPetitionerInformation() {
    let petitionerInformation: PetitionerInformation;
    const applicationPetitionerGuid: string = await this.commonService.newGuidNuevo().toPromise();
    petitionerInformation = {
      applicationPetitionerGuid: applicationPetitionerGuid,
      applicationGuid: this.wizard.policyApplicationModel.applicationGuid,
      petitionerTypeId: PetitionerType.POLICY_HOLDER,
      otherSourceOfFounding: '',
      company: null,
      person: null,
      petitionerType: PetitionerType.getDescription(PetitionerType.POLICY_HOLDER),
      industry: '',
      sourceOfFunding: '',
      addresses: [],
      phones: [],
      emails: [],
      identifications: []
    };
    return petitionerInformation;
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

 /**
 * Creates policy application (Only if the user selected No)
 */
  async createPolicyApplication() {
    this.saveCheckpoint();
    this.wizard.policyApplicationModel.petitioner =  await this.createPetitionerInformation();
    this.wizard.policyApplicationModel.petitionerTypeId = PetitionerType.POLICY_HOLDER;
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
    if (this.f.question.value === 'false') {
      this.router.navigate([this.currentSection.nextStep]);
    }
  }

 /**
 * Checks if has error
 * @param error
 * @returns errors
 */
  checkIfHasError(error) {
    return (error.error);
  }

  back() {
    this.router.navigate([this.currentSection.previousStep]);
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

  get totalSectionByPetitionerType(): number {
    return this._totalSectionByPetitionerType;
  }

  set totalSectionByPetitionerType(value: number) {
    this._totalSectionByPetitionerType = value;
  }

  get sectionActive(): number {
    if (this.petitionerTypeSelected) {
      return this._sectionActive;
    }
  }

  set sectionActive(value: number) {
    this._sectionActive = value;
  }

}
