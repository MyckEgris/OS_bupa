import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Observable, Subscription } from 'rxjs';
import { ModePayment } from 'src/app/shared/services/common/entities/modePayment';
import { MethodPayment } from '../entities/method-payment';
import { METHOD_OF_PAYMENTS } from '../entities/method-payment-list';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { PolicyEnrollmentWizardService } from '../../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { Section } from 'src/app/shared/services/view-template/entities/section';
import { PolicyEnrollmentWizard } from '../../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-policy-enrollment-step9-section1',
  templateUrl: './policy-enrollment-step9-section1.component.html',
  styles: []
})
export class PolicyEnrollmentStep9Section1Component implements OnInit {

  /**
   * PolicyEnrollment Wizard Filtered Current Section
   */
  public currentSection: Section;
  /**
   * PolicyEnrollment Wizard Step Configuration
   */
  private configStep: ViewTemplateStep;

  /***
   * Wizard Subscription
   */
  private subscription: Subscription;

  /**
  * Authenticated User Object
  */
  public user: UserInformationModel;

  /**
   * PolicyEnrollment Wizard Filtered Current Section
   */
  wizard: PolicyEnrollmentWizard;

  /**
   * Const to identify current section
   */
  CURRENT_SECTION = 1;

  /**
   * Const to identify curent step
   */
  CURRENT_STEP = 9;

  /**
   *Creates an instance of PolicyEnrollmentStep9Section1Component.
   * @param {PolicyEnrollmentWizardService} policyEnrollmentWizardService
   * @memberof PolicyEnrollmentStep9Section1Component
   */
  constructor(private policyEnrollmentWizardService: PolicyEnrollmentWizardService) { }

  /**
   * Executed when the component is initiallized
   */
  ngOnInit() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.CURRENT_STEP);
    this.currentSection = this.configStep.sections.find(id => id.id === this.CURRENT_SECTION);
    // this.subscription =
    this.wizard = this.policyEnrollmentWizardService.
                  getPolicyEnrollmentWithSetCurrentStep(null, this.CURRENT_STEP, this.CURRENT_SECTION);
    this.setUpForm();
    //  (wizard: PolicyEnrollmentWizard) => {
    //    this.wizard = wizard;
    //    this.setUpForm();
    //  },
    //  this.user, null, this.CURRENT_STEP, this.CURRENT_SECTION);
  }

  /**
   *Set the step form Group
   * @memberof PolicyEnrollmentStep9Component
   */
  setUpForm() {
    (this.wizard.enrollmentForm.get(this.configStep.type) as FormGroup).removeControl('policyAppPaymentsCreditCard1');
    (this.wizard.enrollmentForm.get(this.configStep.type) as FormGroup).removeControl('policyAppPaymentsCreditCard2');
    this.wizard.enrollmentForm.updateValueAndValidity();
  }



}
