import { Component, OnInit, OnDestroy } from '@angular/core';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Subscription } from 'rxjs';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Utilities } from 'src/app/shared/util/utilities';

@Component({
  selector: 'app-policy-enrollment-step10',
  templateUrl: './policy-enrollment-step10.component.html'
})
export class PolicyEnrollmentStep10Component implements OnInit, OnDestroy {

  public user: any;
  public wizard: PolicyEnrollmentWizard;
  public currentStep = 10;
  private subscription: Subscription;
  public configStep: ViewTemplateStep;
  public sectionActive: number;

  /**
   * Constant for time to delay (ms)
   */
  private TIME_TO_DELAY = 10;

  constructor(private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService
  ) {
  }

  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
  }

  async ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.setSectionStep(this.wizard.currentSection);
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


}

