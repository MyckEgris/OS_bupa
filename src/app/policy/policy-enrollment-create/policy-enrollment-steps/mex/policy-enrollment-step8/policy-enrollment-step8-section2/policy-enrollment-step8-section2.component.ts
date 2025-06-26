import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { Router } from '@angular/router';
import { PolicyEnrollmentWizard } from '../../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { Subscription } from 'rxjs';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { FormGroup, FormControl } from '@angular/forms';
import { Agreement } from 'src/app/shared/services/policy-application/entities/agreement';

@Component({
  selector: 'app-policy-enrollment-step8-section2',
  templateUrl: './policy-enrollment-step8-section2.component.html'
})
export class PolicyEnrollmentStep8Section2Component implements OnInit, OnDestroy {

  /**
   *Const to Identify the current step name
   */
  SECTION_FORMGROUP_NAME = 'agreements';

  /**
     *  Const to Identify the current step name
     */
  STEP_NAME = 'policyApplicationConsents';

  /**
    * Const to Identify the current section name
    */
  SECTION_NAME = 'policyAppConsentsQuestions2';

  /**
   * Const to Identify the Control  questionHabeusData
   */
  QUESTION_HABEAS = 'questionHabeusData';

  /**
   * Const to Identify the Control  questionObligations
   */
  QUESTION_OBLIGATION = 'questionObligations';

  /**
   * Const to Identify the Control  questionScopesAndFunctions
   */
  QUESTION_SCOPES_AND_FUNCTIONS = 'questionScopesAndFunctions';

  /**
   * Const to Identify the Control  disclaimerCheck
   */
  DISCLAIMER_CHECK = 'disclaimerCheck';

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
  private isEdit: boolean;
  /**
   *Creates an instance of PolicyEnrollmentStep8Section2Component.
   * @param {AuthService} authService
   * @param {PolicyEnrollmentWizardService} policyEnrollmentWizardService
   * @param {Router} router
   * @memberof PolicyEnrollmentStep8Section2Component
   */
  constructor(private authService: AuthService,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private router: Router) { }

  /**
   * Executed when the component is destroyed
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Executed when the component is initiallized
   * @memberof PolicyEnrollmentStep8Section2Component
   */
  ngOnInit() {
    window.scroll(0, 0);
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => { this.wizard = wizard; }, this.user, null, this.currentStep, 2);
    this.setupForm();
  }

  /**
   * Sets the Step FormGroup.
   */
  private setupForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.currentSection = this.configStep.sections.find(s => s.id === 2);
    if (localStorage.getItem('mode') === 'Edit') {
      this.isEdit = true;
      if (this.wizard.policyApplicationModel.agreements ||
        this.wizard.policyApplicationModel.agreements.length > 0) {
          const disclaimerCheck: Agreement = this.wizard.policyApplicationModel.agreements.find(id => id.agreementId === 2);
          const habeusData: Agreement = this.wizard.policyApplicationModel.agreements.find(id => id.agreementId === 3);
          const questionObligations: Agreement = this.wizard.policyApplicationModel.agreements.find(id => id.agreementId === 4);
          const questionScopesAndFunctions: Agreement = this.wizard.policyApplicationModel.agreements.find(id => id.agreementId === 5);
          this.getControl('disclaimerCheck').setValue(disclaimerCheck.answer.toString ());
          this.getControl('questionHabeusData').setValue(habeusData.answer.toString());
          this.getControl('questionObligations').setValue(questionObligations.answer.toString());
          this.getControl('questionScopesAndFunctions').setValue(questionScopesAndFunctions.answer.toString());
        }
    } else {
      this.isEdit = false;
    }
  }

  /**
   * Get nested form group.
   */
  public getFormGroup(): FormGroup {
    return this.wizard.enrollmentForm.get(this.configStep.type).get(this.currentSection.name) as FormGroup;
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
  */
  getValidatorMessage(controlName: string, validator: string) {
    return this.policyEnrollmentWizardService.getMessageValidator(this.currentSection, controlName, validator);
  }

  /**
   * Route to next page.
   */
  next(): void {
    if (!this.verifyResponses() || !this.getControl(this.DISCLAIMER_CHECK).value) {
      this.showErrorMsg = true;
    } else {
      this.showErrorMsg = false;
      this.router.navigate([this.configStep.sections.find(x => x.id === 2).nextStep]);
    }
  }

  /**
   * Verify correct Responses that are necesaries
   * @private
   * @returns {boolean}
   */
  private verifyResponses(): boolean {
    return (this.getControl(this.QUESTION_OBLIGATION).valid && this.getControl(this.QUESTION_SCOPES_AND_FUNCTIONS).valid);
  }

  /**
   * Allow to return.
   */
  back(): void {
    this.router.navigate([this.currentSection.previousStep]);
  }

}
