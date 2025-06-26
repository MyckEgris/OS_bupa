import { Component, OnInit, OnDestroy } from '@angular/core';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { Subscription } from 'rxjs';
import { ViewTemplateStep } from 'src/app/shared/services/view-template/entities/view-template-step';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Utilities } from 'src/app/shared/util/utilities';

@Component({
  selector: 'app-policy-enrollment-step8',
  templateUrl: './policy-enrollment-step8.component.html'
})
export class PolicyEnrollmentStep8Component implements OnInit, OnDestroy {

  user: any;
  wizard: PolicyEnrollmentWizard;
  currentStep = 8;
  private subscription: Subscription;
  configStep: ViewTemplateStep;
  sectionActive: number;

  /**
   * Constant for time to delay (ms)
   */
  private TIME_TO_DELAY = 10;
  constructor(private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService) { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.setUpForm();
        this.setSectionStep(this.wizard.currentSection);
      },
      this.user, null, this.currentStep, 0);
      this.generateGuids();
    }

  setUpForm() {
    this.configStep = this.policyEnrollmentWizardService.getConfigStep(this.currentStep);
    this.wizard.enrollmentForm
      .addControl(this.configStep.type,
        this.policyEnrollmentWizardService.buildStep(this.currentStep)
      );
  }

  generateGuids() {
    if (this.configStep) {
      for (let index = 0; index < this.configStep.sections.length; index++) {
        for (let c = 0; c < this.configStep.sections[index].controls.length; c++) {
          this.policyEnrollmentWizardService.scheduleNewGuid();
        }
      }
    }
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
