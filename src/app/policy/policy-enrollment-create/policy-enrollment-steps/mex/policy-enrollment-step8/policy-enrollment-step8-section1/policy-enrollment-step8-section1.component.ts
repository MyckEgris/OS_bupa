import { Section } from 'src/app/shared/services/view-template/entities/section';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PolicyEnrollmentWizard } from '../../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { FormGroup, FormControl } from '@angular/forms';
import { Agreement } from 'src/app/shared/services/policy-application/entities/agreement';

@Component({
  selector: 'app-policy-enrollment-step8-section1',
  templateUrl: './policy-enrollment-step8-section1.component.html'
})
export class PolicyEnrollmentStep8Section1Component implements OnInit, OnDestroy {

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
  DISCLAIMER_CHECK = 'disclaimerCheck';

  /**
   *Const to Identify the current step number
   */
  CURRENT_STEP = 8;

  /**
   * PolicyEnrollment Wizard Object
   */
  wizard: PolicyEnrollmentWizard;

  /**
   * Flag for show form validations.
   */
  showErrorMsg = false;

  /**
   * PolicyEnrollment Wizard Filtered Current Section
   */
  public currentSection: Section;

  /**
   * Authenticated User Object
   */
  public user: any;

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
   *Creates an instance of PolicyEnrollmentStep8Section1Component.
   * @param {AuthService} authService
   * @param {PolicyEnrollmentWizardService} policyEnrollmentWizardService
   * @param {Router} router
   * @memberof PolicyEnrollmentStep8Section1Component
   */
  constructor(
    private authService: AuthService,
    private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private router: Router
  ) { }

  /**
   * Executed when the component is initiallized
   * @memberof PolicyEnrollmentStep8Section1Component
   */
  ngOnInit() {
    window.scroll(0, 0);
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => { this.wizard = wizard; this.setUpForm(); }, this.user, null, this.CURRENT_STEP, 1);
  }


  /**
   * Executed when the component is destroyed
   */
  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  /**
   * Sets the Step FormGroup.
   */
  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.CURRENT_STEP);
    this.wizard.enrollmentForm
      .addControl(this.configStep.type,
        this.policyEnrollmentWizardService.buildStep(this.CURRENT_STEP)
      );
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.CURRENT_STEP);
    this.currentSection = this.configStep.sections.find(s => s.id === 1);
    if (localStorage.getItem('mode') === 'Edit') {
      this.isEdit = true;
      if (this.wizard.policyApplicationModel.agreements ||
        this.wizard.policyApplicationModel.agreements.length > 0) {
          const disclaimerCheck: Agreement = this.wizard.policyApplicationModel.agreements.find(id => id.agreementId === 1);
          this.getControl('disclaimerCheck').setValue(disclaimerCheck.answer.toString());
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
   * Route to next page.
   */
  next(): void {
    if (this.getFormGroup().invalid) {
      this.showErrorMsg = true;
    } else if (!this.getControl(this.DISCLAIMER_CHECK).value) {
      this.showErrorMsg = true;
    } else {
      this.showErrorMsg = false;
      this.router.navigate([this.configStep.sections.find(x => x.id === 1).nextStep]);
    }
  }

  /**
   * Get nested form group.
   */
  public getFormGroup(): FormGroup {
    return this.wizard.enrollmentForm.get(this.configStep.type).get(this.currentSection.name) as FormGroup;
  }

  /**
   * Allow to return.
   */
  back(): void {
    this.router.navigate([this.currentSection.previousStep]);
  }

}
