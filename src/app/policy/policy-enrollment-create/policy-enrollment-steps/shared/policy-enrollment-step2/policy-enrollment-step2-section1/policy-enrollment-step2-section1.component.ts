/**
* policy-enrollment-step2-section1.component.component.ts
*
* @description: This class handle step 2 policy aplication wizard.
* @author Enrique Durango.
* @version 1.0
* @date 29-10-2019.
*
**/
import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { PolicyEnrollmentWizard } from '../../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import * as moment from 'moment';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Router } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { Control } from 'src/app/shared/services/view-template/entities/control';
import { NgbDate } from '@ng-bootstrap/ng-bootstrap/datepicker/ngb-date';

@Component({
  selector: 'app-policy-enrollment-step2-section1',
  templateUrl: './policy-enrollment-step2-section1.component.html'
})
export class PolicyEnrollmentStep2Section1Component implements OnInit, OnDestroy {
    /***
   * Const to Identify the nested FormControl policyApplicationResidentQuestion
   */
  public RESIDENT_QUESTION_CTRL = 'policyApplicationResidentQuestion';

  /**
   * Constant for has resided message title resource key.
   */
  public HAS_RESIDED_MESSAGE_TITLE = 'POLICY.POLICY_ENROLLMENT.STEP1.SECTION_01.RESIDENT_MSG_TITLE';

  /**
   * Constant for has resided affirmative message message resource key.
   */
  public HAS_RESIDED_MESSAGE_AFFIRMATIVE_MESSAGE = 'POLICY.POLICY_ENROLLMENT.STEP1.SECTION_01.RESIDENT_MSG_YES';
  /***
   * Const to Identify the nested FormGroup policyApplicationIntroductionStep
   */
  public OWNER_STEP = 'policyApplicationOwnerStep';
  /**
   * Section formgroup name of policy enrollment step2 section1 component
   */
  public SECTION_FORMGROUP_NAME = 'policyData';
  /**
   * Const required of policy enrollment step2 section1 component
   */
  public CONST_REQUIRED = 'required';
  /**
   * Owner height field of policy enrollment step2 section1 component
   */
  public OWNER_HEIGHT_FIELD = 'policyOwnerHeight';
  /**
   * Owner weight field of policy enrollment step2 section1 component
   */
  public OWNER_WEIGHT_FIELD = 'policyOwnerWeight';
  /**
   * Subscription  of policy enrollment step2 section1 component
   */
  public subscription: Subscription;
  /**
   * User  of policy enrollment step2 section1 component
   */
  public user: UserInformationModel;
  /**
   * Wizard  of policy enrollment step2 section1 component
   */
  public wizard: PolicyEnrollmentWizard;

  /***
   * Const to Identify the saving error title message
   */
  private ERROR_SAVING_TITLE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_TITLE';

  /***
   * Const to Identify the saving error message
   */
  private ERROR_SAVING_MESSAGE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_MESSAGE';

  /***
   * Const to Identify the saving error button message
   */
  private ERROR_SAVING_OK = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_OK';

  /**
   * Marital status default of policy enrollment step2 section1 component
   */
  public MARITAL_STATUS_DEFAULT = 1;
  /**
   * Marital status unknown of policy enrollment step2 section1 component
   */
  public MARITAL_STATUS_UNKNOWN = 5;
  /**
   * Current step of policy enrollment step2 section1 component
   */
  public currentStep = 2;
  /**
   * Current section of policy enrollment step2 section1 component
   */
  public CURRENT_SECTION = 1;
  /**
   * Current string date of policy enrollment step2 section1 component
   */
  public currentStringDate: string;
  /**
   * Show validations of policy enrollment step2 section1 component
   */
  public showValidations: boolean;
  /**
   * Current section of policy enrollment step2 section1 component
   */
  public currentSection: Section;
  /**
   * Show validations age range of policy enrollment step2 section1 component
   */
  public showValidationsAgeRange: boolean;
  /**
   * Determines whether submitted is
   */
  public isSubmitted: boolean;

  /**
   * Config step of policy enrollment step2 section1 component
   */
  private configStep: ViewTemplateStep;
  /**
   * Date selected of policy enrollment step2 section1 component
   */
  public dateSelected: Date;
  /**
   * End date of policy enrollment step2 section1 component (Current date until 90 days)
   */
  public endDate: Date;

  /**
   * Control Country of Residence for Panama
   */
  public iSControlCoRVisible: boolean;
  private KG_MTS = 3;

  /**
   * Mark disabled of policy enrollment step2 section1 component. This callback has the objective to show
   * just 1 and 15 day of the calendar. US 13936
   */
  callbackTomarkDisabled = (date: NgbDate, current: {month: number}) => (date.day > 1 && date.day < 15) || (date.day >= 16);
  /**
   * Creates an instance of policy enrollment step2 section1 component.
   * @param policyEnrollmentWizardService
   * @param authService
   * @param router
   * @param config
   * @param policyApplicationService
   * @param translate
   * @param notification
   */
  constructor(
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private router: Router,
    private config: NgSelectConfig,
    private policyApplicationService: PolicyApplicationService,
    private translate: TranslateService,
    private notification: NotificationService) {
    this.config.notFoundText = '';
  }

  /**
   * on init
   */
  ngOnInit() {
    window.scroll(0, 0);
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.setUpForm();
      }, this.user, null, this.currentStep, 1);
    this.currentSection = this.configStep.sections.find(s => s.id === 1);
    this.valueChanges();
  }

  /**
   * on destroy
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Sets up form
   */
  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.setVisibilityControls();
    this.setValuesDefaultToFormControl();

    this.setDefaultValuesCountries();
  }

  setVisibilityControls() {
    const controlCoR: Control = this.wizard.viewTemplate.steps.find(st => st.stepNumber === this.currentStep)
      .sections.find(s => s.id === 1).controls.find(c => c.key === 'policyOwnerCountryOfResidence');
    this.iSControlCoRVisible = controlCoR.visible;
  }

  /**
   * Sets max date default
   * @returns date until 90
   */
  setMaxDateDefault() {
    return moment(new Date()).add(90, 'days').toDate();
  }
  /**
   * Sets min date default
   * @returns date now
   */
  setMinDateDefault() {
    return moment(new Date()).toDate();
  }
  /**
   * Sets values default to form control
   */
  setValuesDefaultToFormControl() {
    if (this.wizard.enrollmentForm.get(this.configStep.type)
      .get(this.SECTION_FORMGROUP_NAME)
      .get('policyApplicationSinceDate').value === '') {
      // this.dateSelected = new Date();
      // this.wizard.enrollmentForm.get(this.configStep.type).get(this.SECTION_FORMGROUP_NAME)
      //  .get('policyApplicationSinceDate').setValue(this.dateSelected);
    }
    if (this.wizard.enrollmentForm.get(this.configStep.type)
      .get(this.SECTION_FORMGROUP_NAME)
      .get('policyOwnerSystemMeasureId').value === '') {
      this.wizard.enrollmentForm.get(this.configStep.type)
        .get(this.SECTION_FORMGROUP_NAME)
        .get('policyOwnerSystemMeasureId').setValue(this.KG_MTS);
    }
  }

  /**
   * Sets country of residency
   */
  private setCountryOfResidency(countryId: number) {
    if (!this.wizard.enrollmentForm.get(this.configStep.type)
      .get(this.SECTION_FORMGROUP_NAME)
      .get('policyOwnerCountryOfResidence').value) {
      this.wizard.enrollmentForm.get(this.configStep.type)
        .get(this.SECTION_FORMGROUP_NAME)
        .get('policyOwnerCountryOfResidence').setValue(countryId);
    }
  }

  /**
   * Sets default nationality
   */
  private setDefaultNationality(countryId: number) {
    if (!this.wizard.enrollmentForm.get(this.configStep.type)
      .get(this.SECTION_FORMGROUP_NAME)
      .get('policyOwnerNationality').value) {
      this.wizard.enrollmentForm.get(this.configStep.type)
        .get(this.SECTION_FORMGROUP_NAME)
        .get('policyOwnerNationality').setValue(countryId);
    }
  }

  /**
   * Sets default country of birth
   */
  private setDefaultCountryOfBirth(countryId: number) {
    if (!this.wizard.enrollmentForm.get(this.configStep.type)
      .get(this.SECTION_FORMGROUP_NAME)
      .get('policyOwnerCob').value) {
      this.wizard.enrollmentForm.get(this.configStep.type)
        .get(this.SECTION_FORMGROUP_NAME)
        .get('policyOwnerCob').setValue(countryId);
    }
  }

  /**
   * Sets default values countries
   * @param formControlName
   */
  setDefaultValuesCountries() {
    this.wizard.countries$.subscribe(c => {
      if (c.find(i => i.isoAlpha === this.user.cc)) {
        const countryId = c.find(i => i.isoAlpha === this.user.cc).countryId;
        this.setCountryOfResidency(countryId);
        this.setDefaultNationality(countryId);
        this.setDefaultCountryOfBirth(countryId);
      }
    });
  }

  /**
   * Determines whether field value greater than cero is
   * @param field of form control
   * @returns true or false
   */
  isFieldValueGreaterThanCero(field: string) {
    if (this.wizard.enrollmentForm.get(this.configStep.type)
      .get(this.SECTION_FORMGROUP_NAME)
      .get(field).value > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Determines whether field required is
   * @param field form of control
   * @returns true or false
   */
  isFieldRequired(field: string) {
    if (this.wizard.enrollmentForm.get(this.configStep.type)
      .get(this.SECTION_FORMGROUP_NAME)
      .get(field).hasError(this.CONST_REQUIRED)) {
      return true;
    } else {
      return false;
    }
  }
  /**
   * Next policy enrollment step2 section1 component
   * @param form
   */
  next(form) {
    if (this.wizard.enrollmentForm.get(this.configStep.type).get(this.SECTION_FORMGROUP_NAME).valid
      && this.isFieldValueGreaterThanCero(this.OWNER_HEIGHT_FIELD)
      && this.isFieldValueGreaterThanCero(this.OWNER_WEIGHT_FIELD)) {
      this.createPolicyApplication();
      this.showValidations = false;
    } else {
      this.showValidations = true;
      if (this.isAgeRangeInValid()) {
        this.showValidationsAgeRange = true;
      }
      this.validateAllFormFields(this.wizard.enrollmentForm);
    }
  }
  /**
   * Backs policy enrollment step2 section1 component
   */
  back() {
    this.showValidations = false;
    this.router.navigate([this.configStep.sections.find(x => x.id === 1).previousStep]);
  }
  /**
   * Determines whether age range in valid is
   * @returns true if age range in valid
   */
  isAgeRangeInValid(): boolean {
    const selectedDate = this.wizard.enrollmentForm.get(this.configStep.type)
      .get(this.SECTION_FORMGROUP_NAME)
      .get('policyOwnerDob').value;
    const currentDate = Date.now();
    const ageDiff = moment(currentDate).diff(selectedDate, 'year');
    if (ageDiff >= 65 && ageDiff <= 74) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Validates all form fields
   * @param formGroup
   */
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  /**
   * Gets control
   * @param field
   * @returns formControl
   */
  getControl(field: string) {
    return this.wizard.enrollmentForm.get(this.OWNER_STEP).get(this.SECTION_FORMGROUP_NAME).get(field) as FormControl;
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

  /**
   * Determines whether field valid is
   * @param field
   * @returns return if a field is valid or not
   */
  isFieldValid(field: string) {
    return !this.wizard.enrollmentForm.get(this.configStep.type)
      .get(this.configStep.sections.find(x => x.id === this.currentStep).name)
      .get(field).valid
      && this.wizard.enrollmentForm.get(this.configStep.type)
        .get(this.configStep.sections.find(x => x.id === this.currentStep).name)
        .get(field).touched;
  }

  /**
   * Save the form information in the wizard service and show sucess message.
   */
  createPolicyApplication() {
    this.saveCheckpoint();
    this.policyEnrollmentWizardService.buildPolicyApplication();
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
    if (!this.wizard.policyApplicationModel.currentStepCompleted) {
      this.wizard.policyApplicationModel.currentStepCompleted =
        JSON.stringify(this.createCheckpoint(this.currentStep, this.currentSection.id));
    }
  }

  private createCheckpoint(stepNumber: number, sectionId: number) {
    return {
      stepNumber: stepNumber,
      sectionId: sectionId
    };
  }


  /**
   * Check for request errors.
   */
  checkIfHasError(error) {
    return (error.error);
  }

  /**
   * Store the succes request id in wizard and continue to next page.
   */
  async success(policyApplicationOutput: PolicyApplicationOutputDto) {
    this.wizard.policyApplicationModel.applicationId = policyApplicationOutput.applicationId;
    this.nextPage();
  }

  /**
   * Route to next page.
   */
  nextPage() {
    this.router.navigate([this.configStep.sections.find(x => x.id === 1).nextStep]);
  }

  public handleResidentYes(event) {
    if (event) {
      const value = (event.target.value === 'true' ? true : false);
      if (value) {
        this.showHasResidedModalMessage(value);
      }
    }
  }

    /**
   * Show resident modal message.
   */
  async showHasResidedModalMessage(hasResided: any) {
    let response;
    let message = '';
    let title = '';
    if (hasResided) {
      this.translate.get(this.HAS_RESIDED_MESSAGE_TITLE).subscribe(
        result => title = result);
      this.translate.get(this.HAS_RESIDED_MESSAGE_AFFIRMATIVE_MESSAGE).subscribe(
        result => message = result);
      response = await this.notification.showDialog(title, message);
      if (response) {
        this.router.navigate(['/']);
      }
    }
  }

  valueChanges() {
    this.getControl(this.RESIDENT_QUESTION_CTRL).valueChanges.subscribe(val => {
      this.validateResidentQuestion(val);
    });
  }

    /**
   * Validate value of resident question.
   */
  validateResidentQuestion(val: any) {
    const value = (val === 'true' ? true : false);
    if (value) {
      localStorage.setItem('enrollmentMaxStep', '0');
    }
  }
      /**
   * Determines whether control visible is
   * @param controlName
   * @returns true if control visible
   */
  isControlVisible(controlName: string): boolean {
    return this.policyEnrollmentWizardService.isControlVisible(this.currentStep, this.currentSection.id, controlName);
  }
}
