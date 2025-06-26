import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription } from 'rxjs';
import { PolicyChangesWizard } from './policy-changes-wizard/entities/policy-changes-wizard';
import { PolicyChangesWizardService } from './policy-changes-wizard/policy-changes-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Utilities } from 'src/app/shared/util/utilities';

@Component({
  selector: 'app-policy-changes',
  templateUrl: './policy-changes.component.html'
})
export class PolicyChangesComponent implements OnInit, OnDestroy {

  public currentStep = 1;

  private user: UserInformationModel;

  private subscription: Subscription;

  /**
   * RequestInformationWizard Object
   */
  public wizard: PolicyChangesWizard;

  /**
   * Constant for time to delay (ms)
   */
  private TIME_TO_DELAY = 10;

  constructor(
    private policyChangesWizardService: PolicyChangesWizardService,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyChangesWizardService.beginPolicyChangesWizardServiceWizard(wizard => {
      this.wizard = wizard;
      this.setStep(this.wizard.currentStep);
    }, this.user, this.currentStep);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.policyChangesWizardService.endPolicyChangesWizard(this.user);
  }

  /**
   * Establish step to current step
   * @param step Step number
   */
  async setStep(step: number) {
    await Utilities.delay(this.TIME_TO_DELAY);
    this.currentStep = step;
  }

}
