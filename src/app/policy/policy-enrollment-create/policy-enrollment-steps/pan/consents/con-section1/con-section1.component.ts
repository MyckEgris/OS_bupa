import { Component, OnInit, OnDestroy } from '@angular/core';
import { PolicyEnrollmentWizard } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { Section } from 'src/app/shared/services/view-template/entities/section';
// tslint:disable-next-line: max-line-length
import { PolicyEnrollmentWizardService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription } from 'rxjs';
import { Agreement } from 'src/app/shared/services/policy-application/entities/agreement';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
// tslint:disable-next-line: max-line-length
import { TransformConsentsService } from 'src/app/policy/policy-enrollment-create/policy-enrollment-wizard/mappers-services-pan/transform-consents.service';
import { AgreementDefinition } from 'src/app/shared/services/common/entities/agreement-def-enrollment-response';
@Component({
  selector: 'app-con-section1',
  templateUrl: './con-section1.component.html'
})
export class ConSection1Component implements OnInit, OnDestroy {
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
  /**
   *  Const to Identify the current step name
   */
  STEP_NAME = 'policyApplicationConsents';

  /**
     * Const to Identify the current section name
     */
  SECTION_NAME = 'policyAppConsents';
  /**
   * Const to Identify the Control  disclaimerCheck
   */
  SUBSCRIBER_PRIVACY_NOTICE = 'subscriberPrivacyNotice';

  /**
   *Const to Identify the current step number
   */
  CURRENT_STEP = 8;

  /**
   * PolicyEnrollment Wizard Object
   */
  wizard: PolicyEnrollmentWizard;
  /**
   * PolicyEnrollment Wizard Step Configuration
   */
  private configStep: ViewTemplateStep;
    /**
   * PolicyEnrollment Wizard Filtered Current Section
   */
  public currentSection: Section;
  /**
   * User  of policy enrollment step2 component
   */
  public user: UserInformationModel;
  /***
   * Wizard Subscription
   */
  private subscription: Subscription;
  /**
   * Flag for show form validations.
   */
  showErrorMsg: boolean;
  private agreementDefinition: Array<AgreementDefinition>;
  constructor(private authService: AuthService,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private policyApplicationService: PolicyApplicationService,
    private router: Router,
    private translate: TranslateService,
    private notification: NotificationService,
    private transformConsentsService: TransformConsentsService) { }

    /**
   * Executed when the component is destroyed
   */
  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  ngOnInit() {
    window.scroll(0, 0);
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.setUpForm();
      }, this.user, null, this.CURRENT_STEP, 1);
  }

    /**
   * Sets the Step FormGroup.
   */
  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.CURRENT_STEP);
    this.wizard.enrollmentForm.addControl(this.configStep.type, this.policyEnrollmentWizardService.buildStep(this.CURRENT_STEP));
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.CURRENT_STEP);
    this.currentSection = this.configStep.sections.find(s => s.id === 1);
    this.wizard.agreementDefintion$.subscribe(agreements => {
      this.agreementDefinition = agreements;
      if (localStorage.getItem('mode') === 'Edit' && this.wizard.policyApplicationModel.agreements.length > 0) {
        this.getControl(this.SUBSCRIBER_PRIVACY_NOTICE).setValue(
          this.wizard.policyApplicationModel.agreements
            .find(a => a.agreementId === agreements
            .find(i => i.agreementName.toLowerCase() === this.SUBSCRIBER_PRIVACY_NOTICE.toLowerCase()).agreementId)
            .answer);
      }
    });
  }

    /**
  * Get nested form controls.
  */
  getControl(field: string) {
    return this.wizard.enrollmentForm.get(this.configStep.type).get(this.currentSection.name).get(field) as FormControl;
  }

  /**
   * Get nested validator
   */
  getValidatorValue(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getValidatorValue(this.currentSection, controlName, validator);
  }

  /**
   * Get nested form group.
   */
  public getFormGroup(): FormGroup {
    return this.wizard.enrollmentForm.get(this.configStep.type).get(this.currentSection.name) as FormGroup;
  }
    /**
   * Route to next page.
   */
  next(): void {
    if (this.getFormGroup().invalid) {
      this.showErrorMsg = true;
    } else if (!this.getControl(this.SUBSCRIBER_PRIVACY_NOTICE).value) {
      this.showErrorMsg = true;
    } else {
      this.showErrorMsg = false;
      this.createPolicyApplication();
    }
  }
    /**
   * Allow to return.
   */
  back(): void {
    this.router.navigate([this.currentSection.previousStep]);
  }

   /**
 * Creates policy application (Only if the user selected No)
 */
  async createPolicyApplication() {
    this.saveCheckpoint();
    await this.createOrUpdateAgreement();
      this.policyApplicationService.createPolicyEnrollment(this.wizard.policyApplicationModel).subscribe(p => {
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
    if (currentStepCompleted.stepNumber === this.CURRENT_STEP) {
      const totalSections = this.wizard.viewTemplate.steps.find(st => st.stepNumber === currentStepCompleted.stepNumber).sections.length;
      if (totalSections > 1 && currentStepCompleted.sectionId < this.currentSection.id) {
        this.wizard.policyApplicationModel.currentStepCompleted =
          JSON.stringify(this.createCheckpoint(this.CURRENT_STEP, this.currentSection.id));
      }
    } else {
      if (currentStepCompleted.stepNumber < this.CURRENT_STEP) {
        this.wizard.policyApplicationModel.currentStepCompleted =
          JSON.stringify(this.createCheckpoint(this.CURRENT_STEP, this.currentSection.id));
      }
    }
  }

  private createCheckpoint(stepNumber: number, sectionId: number) {
    return {
      stepNumber: stepNumber,
      sectionId: sectionId
    };
  }

  async createOrUpdateAgreement() {
    if (this.wizard.policyApplicationModel.agreements.length === 0) {
      const agreement =  await this.transformConsentsService.createNewAgreement(
        this.getFormGroup().get(this.SUBSCRIBER_PRIVACY_NOTICE).value,
        this.agreementDefinition.find(a => a.agreementName.toLowerCase() === this.SUBSCRIBER_PRIVACY_NOTICE.toLowerCase()).agreementId,
        this.wizard.policyApplicationModel.applicationGuid);
      this.wizard.policyApplicationModel.agreements.push(agreement);
    } else {
      this.wizard.policyApplicationModel.agreements
        .find(ai => ai.agreementId === this.agreementDefinition
        .find(a => a.agreementName.toLowerCase() === this.SUBSCRIBER_PRIVACY_NOTICE.toLowerCase()).agreementId)
        .answer = this.getFormGroup().get(this.SUBSCRIBER_PRIVACY_NOTICE).value;
    }
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

}
