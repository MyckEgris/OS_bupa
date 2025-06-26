import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Subscription } from 'rxjs';
import { PreAuthorizationWizard } from './pre-authorization-wizard/entities/pre-authorization-wizard';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PreAuthorizationWizardService } from './pre-authorization-wizard/pre-authorization-wizard.service';
import { Utilities } from 'src/app/shared/util/utilities';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pre-authorization',
  templateUrl: './pre-authorization.component.html'
})
export class PreAuthorizationComponent implements OnInit, OnDestroy {

  public currentStep = 1;

  private user: UserInformationModel;

  private subscription: Subscription;

  /**
   * PreAuthorizationWizard Object
   */
  public wizard: PreAuthorizationWizard;

  /**
   * Constant for time to delay (ms)
   */
  private TIME_TO_DELAY = 10;

  private CANCEL_TITLE = 'POLICY.APPLICATION.STEP3.CANCEL_TITLE';
  private CANCEL_MESSAGE = 'POLICY.APPLICATION.STEP3.CANCEL_MESSAGE';
  private CANCEL_YES = 'POLICY.APPLICATION.STEP3.CANCEL_YES';
  private CANCEL_NO = 'POLICY.APPLICATION.STEP3.CANCEL_NO';

  constructor(
    private authService: AuthService,
    private preAuthWizardService: PreAuthorizationWizardService,
    private translate: TranslateService,
    private notification: NotificationService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.preAuthWizardService.beginPreAuthWizardServiceWizard(wizard => {
      this.wizard = wizard;
      this.setStep(this.wizard.currentStep);
    }, this.user, this.currentStep);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.preAuthWizardService.endPreAuthWizard(this.user);
  }

  /**
   * Establish step to current step
   * @param step Step number
   */
  async setStep(step: number) {
    await Utilities.delay(this.TIME_TO_DELAY);
    this.currentStep = step;
  }

  /***
   * TODO: Cambiar rediret
   */
  async goToSearch() {
    /*const title = await this.translate.get(this.CANCEL_TITLE).toPromise();
    const message = await this.translate.get(this.CANCEL_MESSAGE).toPromise();
    const yes = await this.translate.get(this.CANCEL_YES).toPromise();
    const no = await this.translate.get(this.CANCEL_NO).toPromise();
    const confirmGo = await this.notification.showDialog(title, message, true, yes, no);
    if (confirmGo) {
      this.router.navigate(['claims/pre-authorization-search']);
    }*/

    this.router.navigate(['claims/pre-authorization-view']);
  }

}
