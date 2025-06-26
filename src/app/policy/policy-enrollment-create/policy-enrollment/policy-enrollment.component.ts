import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PolicyEnrollmentWizard } from '../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { PolicyEnrollmentWizardService } from '../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { Utilities } from 'src/app/shared/util/utilities';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-policy-enrollment',
  templateUrl: './policy-enrollment.component.html'
})
export class PolicyEnrollmentComponent implements OnInit, OnDestroy {


  private TIME_TO_DELAY = 10;
  private subscription: Subscription;
  public wizard: PolicyEnrollmentWizard;
  public currentStep = 1;
  private user: UserInformationModel;


  constructor(
    private policyEnrollment: PolicyEnrollmentWizardService,
    private authService: AuthService,
    private activateRoute: ActivatedRoute,
    private location: Location) { }

  /***
   * Initialize the json viewTemplate loaded from a resolve
   */
  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollment.beginPolicyEnrollmentWizard(wizard => {
      this.wizard = wizard;
      this.setStep(this.wizard.currentStep);
    }, this.user, this.activateRoute.snapshot.data['viewTemplate'], this.currentStep, null,
      this.activateRoute.snapshot.data['applicationModel']);
    localStorage.setItem('enrollmentMaxStep', '0');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.policyEnrollment.endPolicyEnrollmentWizard(this.user);
    localStorage.removeItem('enrollmentMaxStep');
  }

  async setStep(step: number) {
    await Utilities.delay(this.TIME_TO_DELAY);
    this.currentStep = step;
  }

  get isSummary(): boolean {
    return this.location.path().includes('summary-final');
  }
}
