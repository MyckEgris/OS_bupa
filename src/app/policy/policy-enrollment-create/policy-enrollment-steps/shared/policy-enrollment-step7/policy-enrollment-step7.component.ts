/**
* PolicyEnrollmentStep7Component.ts
*
* @description: Policy Enrollment Step7
* @author Esteban Garzon Guerrero.
* @version 1.0
* @date NOV-2019.
* @dateModified SEP-2020 by Enrique Durango
**/

import { Component, OnInit, OnDestroy } from '@angular/core';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Subscription } from 'rxjs';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import * as moment from 'moment';
@Component({
  selector: 'app-policy-enrollment-step7',
  templateUrl: './policy-enrollment-step7.component.html'
})
export class PolicyEnrollmentStep7Component implements OnInit, OnDestroy {
  showValidations: boolean;
  user: any;
  wizard: PolicyEnrollmentWizard;
  currentStep = 7;
  subscription: Subscription;
  configStep: ViewTemplateStep;
  currentSection: Section;
  STEP_NAME = 'policyApplicationOthersInsurance';
  CONST_REQUIRED = 'required';
  showMsgChecks: boolean;
  showMsgFields: boolean;
  dateSelected: Date;
  private ERROR_SAVING_TITLE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_TITLE';
  private ERROR_SAVING_MESSAGE = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_MESSAGE';
  private ERROR_SAVING_OK = 'POLICY.POLICY_ENROLLMENT.ERROR.ERROR_SAVING_OK';
  FORM_GROUP_QUESTION = 'policyApplicationQuestionOtherInsurances';
  constructor(private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private policyApplicationService: PolicyApplicationService,
    private translate: TranslateService,
    private notification: NotificationService,
    private router: Router,
    private fb: FormBuilder) { }

  /**
   * OnInit of form, initial validations and set configuration step
   */
  ngOnInit() {
    window.scroll(0, 0);
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.setUpForm();
      }, this.user, null, this.currentStep, null);
  }

  /**
   * Distroy Subscription object
   */
  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * ***************
   */
  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.currentSection = this.configStep.sections.find(s => s.id === 1);
    this.dateSelected = new Date();

    this.wizard.enrollmentForm.addControl(this.FORM_GROUP_QUESTION,
      this.fb.group({question: this.fb.control('', [Validators.required])}));

    if (localStorage.getItem('mode') === 'Edit') {
      if (this.wizard.policyApplicationModel.otherInsurance) {
        // Build form
        this.buildForm();
        // Assign values to form
        this.getControl('companyName').setValue(this.wizard.policyApplicationModel.otherInsurance.companyName);
        this.getControl('policyNumber').setValue(this.wizard.policyApplicationModel.otherInsurance.policyNumber);
        this.getControl('renewalDate').setValue(moment(this.wizard.policyApplicationModel.otherInsurance.renewalDate).toDate());
        this.getControl('deductibleValue').setValue(this.wizard.policyApplicationModel.otherInsurance.deductibles);
        this.wizard.enrollmentForm.get(this.FORM_GROUP_QUESTION).get('question').setValue('true');
      } else {
        this.wizard.enrollmentForm.get(this.FORM_GROUP_QUESTION).get('question').setValue('false');
      }
    }
  }

  private buildForm() {
    this.wizard.enrollmentForm.addControl(this.configStep.type, this.policyEnrollmentWizardService.buildStep(this.currentStep));
  }

  /**
   * Validate form
   */
  isFormValid() {
     return this.wizard.enrollmentForm.get(this.STEP_NAME).get(this.currentSection.name).valid;
  }

  /**
   * Get info of fields
   */
  getControl(field: string) {
    return this.wizard.enrollmentForm.get(this.STEP_NAME).get(this.currentSection.name).get(field) as FormControl;
  }

  /**
   * Get validation value of fields
   */
  getValidatorValue(controlName: string, validator: string) {
    const validatorRes = this.policyEnrollmentWizardService.getValidatorValue(this.currentSection, controlName, validator);
    return validatorRes;
  }

  /**
   * Get validation message of fields
   */
  getValidatorMessage(controlName: string, validator: string) {
    const msg = this.policyEnrollmentWizardService.getMessageValidator(this.currentSection, controlName, validator);
    return msg;
  }

  /**
   * save information of step 7
   */
  createPolicyApplication() {
    this.saveCheckpoint();
    if (this.wizard.enrollmentForm.get(this.FORM_GROUP_QUESTION).get('question').value === 'true') {
      this.policyEnrollmentWizardService.buildPolicyApplication();
    }
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
    if (currentStepCompleted.stepNumber === this.currentStep) {
      const totalSections = this.wizard.viewTemplate.steps.find(st => st.stepNumber === currentStepCompleted.stepNumber).sections.length;
      if (totalSections > 1 && currentStepCompleted.sectionId < this.currentSection.id) {
        this.wizard.policyApplicationModel.currentStepCompleted =
          JSON.stringify(this.createCheckpoint(this.currentStep, this.currentSection.id));
      }
    } else {
      if (currentStepCompleted.stepNumber < this.currentStep) {
        this.wizard.policyApplicationModel.currentStepCompleted =
          JSON.stringify(this.createCheckpoint(this.currentStep, this.currentSection.id));
      }
    }
  }

  private createCheckpoint(stepNumber: number, sectionId: number) {
    return {
      stepNumber: stepNumber,
      sectionId: sectionId
    };
  }

  /**
   * Async success method
   */
  async success(policyApplicationOutput: PolicyApplicationOutputDto) {
    this.wizard.policyApplicationModel.applicationId = policyApplicationOutput.applicationId;
    this.nextPage();
  }

  /**
   * Invoque router for navigate in next step
   */
  nextPage() {
    this.router.navigate([this.currentSection.nextStep]);
  }

  /**
   * Verify errors
   */
  checkIfHasError(error: { error: any; }) {
    return (error.error);
  }

  buildStepFormGroup() {
    this.buildForm();
  }

  removeStepFormGroup() {
    this.wizard.enrollmentForm.removeControl(this.STEP_NAME);
    if (this.wizard.policyApplicationModel.otherInsurance) {
      this.wizard.policyApplicationModel.otherInsurance = null;
    }
    this.showValidations = false;
  }

  /**
   * Method for keep next step and save the information of step
   */
  next() {
    if (this.wizard.enrollmentForm.valid) {
      this.showValidations = false;
      this.showMsgChecks = false;
      this.createPolicyApplication();
    } else {
      if (this.wizard.enrollmentForm.get(this.FORM_GROUP_QUESTION).get('question').invalid) {
        this.showMsgChecks = true;
      } else {
        this.showMsgChecks = false;
        this.showValidations = true;
      }
    }
  }

  /**
   * Method for return previous step
   */
  back(): void {
    this.router.navigate([this.currentSection.previousStep]);
  }

  isControlReady(formControlName: string) {
    return this.wizard.enrollmentForm.get(this.STEP_NAME).get(this.currentSection.name).get(formControlName) ? true : false;
  }

  get isFormGroupStepReady() {
    return this.wizard.enrollmentForm.get(this.STEP_NAME) ? true : false;
  }

  get isQuestionValid() {
    return this.wizard.enrollmentForm.get(this.FORM_GROUP_QUESTION).get('question').valid;
  }

}
