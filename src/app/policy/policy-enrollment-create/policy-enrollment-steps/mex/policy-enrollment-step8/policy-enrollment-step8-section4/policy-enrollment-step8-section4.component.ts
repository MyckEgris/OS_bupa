import { Component, OnInit, OnDestroy } from '@angular/core';
import { PolicyEnrollmentWizard } from '../../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { Subscription } from 'rxjs';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { PolicyApplicationOutputDto } from 'src/app/shared/services/policy/entities/policyApplicationOutput.dto';
import { PolicyApplicationService } from 'src/app/shared/services/policy-application/policy-application.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { Agreement } from 'src/app/shared/services/policy-application/entities/agreement';

@Component({
  selector: 'app-policy-enrollment-step8-section4',
  templateUrl: './policy-enrollment-step8-section4.component.html'
})
export class PolicyEnrollmentStep8Section4Component implements OnInit, OnDestroy {

  /**
   *  Const to Identify the current step name
   */
  STEP_NAME = 'policyApplicationConsents';

  /**
     * Const to Identify the current section name
     */
  SECTION_NAME = 'policyAppConsentsQuestions4';

  /**
   * Const to Identify the Control  disclaimerCheckLawfulOfResources
   */
  DISCLAIMER_LAWFUL = 'disclaimerCheckLawfulOfResources';

  /**
   * Const to Identify the Control  disclaimerCheckRecognition
   */
  DISCLAIMER_RECOGNITION = 'disclaimerCheckRecognition';

  /**
   * Const to Identify the Control  promoterKey
   */
  PROMOTER_KEY = 'promoterKey';

  /**
   * Const to Identify the Control  emailConsents
   */
  EMAIL_CONSENTS = 'emailConsents';

  /**
   * Flag for show form validations.
   */
  showErrorMsg = false;

  /**
   * PolicyEnrollment Wizard Object
   */
  wizard: PolicyEnrollmentWizard;

  /**
   * PolicyEnrollment Wizard Filtered Current Section
   */
  public currentSection: Section;

  /**
   * Authenticated User Object
   */
  public user: any;

  /**
   *Const to Identify the current step number
   */
  public currentStep = 8;

  /***
  * Wizard Subscription
  */
  private subscription: Subscription;

  /**
   * PolicyEnrollment Wizard Step Configuration
   */
  private configStep: ViewTemplateStep;

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
  private isEdit: boolean;
  /**
   *Creates an instance of PolicyEnrollmentStep8Section4Component.
   * @param {AuthService} authService
   * @param {PolicyEnrollmentWizardService} policyEnrollmentWizardService
   * @param {Router} router
   * @param {PolicyApplicationService} policyApplicationService
   * @param {TranslateService} translate
   * @param {NotificationService} notification
   * @memberof PolicyEnrollmentStep8Section4Component
   */
  constructor(private authService: AuthService,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private router: Router,
    private policyApplicationService: PolicyApplicationService,
    private translate: TranslateService,
    private notification: NotificationService) { }


  /**
   * Executed when the component is destroyed
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   *Executed when the component is initiallized
   */
  ngOnInit() {
    window.scroll(0, 0);
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => { this.wizard = wizard; }, this.user, null, this.currentStep, 4);
    this.setupForm();
  }

  /**
   * Sets the Step FormGroup.
   */
  private setupForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.currentSection = this.configStep.sections.find(s => s.id === 4);
    if (localStorage.getItem('mode') === 'Edit') {
      this.isEdit = true;
      if (this.wizard.policyApplicationModel.agreements ||
        this.wizard.policyApplicationModel.agreements.length > 0) {
          const disclaimerCheckLawfulOfResources: Agreement = this.wizard.policyApplicationModel.agreements
            .find(id => id.agreementId === 8);
          const disclaimerCheckRecognition: Agreement = this.wizard.policyApplicationModel.agreements.find(id => id.agreementId === 9);
          this.getControl('disclaimerCheckLawfulOfResources').setValue(disclaimerCheckLawfulOfResources.answer.toString());
          this.getControl('disclaimerCheckRecognition').setValue(disclaimerCheckRecognition.answer.toString());
          this.getControl('promoterKey').setValue(this.wizard.policyApplicationModel.promoterKey);
          this.getControl('emailConsents').setValue(this.wizard.policyApplicationModel.promoterEmail);
        }
    } else {
      this.isEdit = false;
    }
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
   * Get Nested Message
   * @param controlName
   * @param validator
   */
  getValidatorMessage(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getMessageValidator(this.currentSection, controlName, validator);
  }

  /**
   * Get Nested correct Values from disclaimers
   */
  getValueDisclaimer(): boolean {
    return (this.getFormGroup().valid &&
      (!this.getControl(this.DISCLAIMER_RECOGNITION).value || !this.getControl(this.DISCLAIMER_LAWFUL).value));
  }

  /**
   * Route to next page.
   */
  next() {
    if (this.getFormGroup().valid &&
      this.getControl(this.DISCLAIMER_RECOGNITION).value && this.getControl(this.DISCLAIMER_LAWFUL).value) {
      this.showErrorMsg = false;
      this.createPolicyApplication();
    } else {
      this.showErrorMsg = true;
    }
  }

  /**
     * Allow to return.
     */
  back() {
    this.router.navigate([this.currentSection.previousStep]);
  }

  /**
  * Get nested form group.
  */
  public getFormGroup(): FormGroup {
    return this.wizard.enrollmentForm.get(this.STEP_NAME).get(this.SECTION_NAME) as FormGroup;
  }

  /**
   * Save the form information in the wizard service and show sucess message.
   */
  createPolicyApplication() {
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
    this.router.navigate([this.currentSection.nextStep]);
  }
}
