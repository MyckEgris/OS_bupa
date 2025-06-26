import { AuthService } from './../../../security/services/auth/auth.service';
import { Utilities } from './../../../shared/util/utilities';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { PolicyApplicationWizard } from '../policy-application-wizard/entities/policy-application-wizard';
import { PolicyApplicationWizardService } from '../policy-application-wizard/policy-application-wizard.service';
import { NotificationService } from '../../../shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-policy-application',
  templateUrl: './policy-application.component.html'
})
export class PolicyApplicationComponent implements OnInit, OnDestroy {

  /**
   * Constant for time to delay (ms)
   */
  private TIME_TO_DELAY = 10;

  /**
   * Subscription
   */
  private subscription: Subscription;

  /**
   * PolicyApplicationWizard Object
   */
  public wizard: PolicyApplicationWizard;

  public currentStep = 1;

  private user;

  private CANCEL_TITLE = 'POLICY.APPLICATION.STEP3.CANCEL_TITLE';

  private CANCEL_MESSAGE = 'POLICY.APPLICATION.STEP3.CANCEL_MESSAGE';

  private CANCEL_YES = 'POLICY.APPLICATION.STEP3.CANCEL_YES';

  private CANCEL_NO = 'POLICY.APPLICATION.STEP3.CANCEL_NO';

  constructor(
    private policyApplication: PolicyApplicationWizardService,
    private authService: AuthService,
    private notification: NotificationService,
    private router: Router,
    private translate: TranslateService,
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyApplication.beginPolicyApplicationWizard(wizard => {
      this.wizard = wizard;
      this.setStep(this.wizard.currentStep);
    }, this.user, this.currentStep);
  }

  /**
   * Ends subscription to wizard subject
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.policyApplication.endPolicyApplicationWizard(this.user);
  }

  /**
   * Establish step to current step
   * @param step Step number
   */
  async setStep(step: number) {
    await Utilities.delay(this.TIME_TO_DELAY);
    this.currentStep = step;
  }

  async goToSearch() {
    const title = await this.translate.get(this.CANCEL_TITLE).toPromise();
    const message = await this.translate.get(this.CANCEL_MESSAGE).toPromise();
    const yes = await this.translate.get(this.CANCEL_YES).toPromise();
    const no = await this.translate.get(this.CANCEL_NO).toPromise();
    const confirmGo = await this.notification.showDialog(title, message, true, yes, no);
    if (confirmGo) {
      this.router.navigate(['policies/policy-application-view']);
    }
  }
}
