import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Utilities } from 'src/app/shared/util/utilities';
@Component({
  selector: 'app-consents',
  templateUrl: './consents.component.html'
})
export class ConsentsComponent implements OnInit, OnDestroy {
  /**
   * User  of policy enrollment step2 component
   */
  public user: UserInformationModel;
  /**
   * Wizard  of policy enrollment step2 component
   */
  public wizard: PolicyEnrollmentWizard;
  /**
   * Current step of policy enrollment step2 component
   */
  public currentStep = 8;
  /**
   * Subscription  of policy enrollment step2 component
   */
  private subscription: Subscription;
  /**
   * Config step of policy enrollment step2 component
   */
  public configStep: ViewTemplateStep;
  /**
   * Section active of policy enrollment step2 component
   */
  public sectionActive: number;

  /**
   * Constant for time to delay (ms)
   */
  private TIME_TO_DELAY = 10;

  constructor(private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService) { }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }
  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.setSectionStep(this.wizard.currentSection);
        this.setUpForm();
       },
      this.user, null, this.currentStep, 0);
  }

  /**
   * Establish step to current step
   * @param step Step number
   */
  async setSectionStep(step: number) {
    await Utilities.delay(this.TIME_TO_DELAY);
    this.sectionActive = step;
  }

  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.wizard.enrollmentForm
      .addControl(this.configStep.type,
        this.policyEnrollmentWizardService.buildStep(this.currentStep)
      );
  }

}
