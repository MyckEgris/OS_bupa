import { Component, OnInit, OnDestroy } from '@angular/core';
import { PolicyChangesWizard } from '../policy-changes-wizard/entities/policy-changes-wizard';
import { Subscription } from 'rxjs';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { PolicyChangesWizardService } from '../policy-changes-wizard/policy-changes-wizard.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';

@Component({
  selector: 'app-policy-changes-step3',
  templateUrl: './policy-changes-step3.component.html'
})
export class PolicyChangesStep3Component implements OnInit, OnDestroy {

    /**
   * Constant for current step # 2
   */
  public currentStep = 3;

  /**
   * PolicyChangesWizard Object
   */
  public wizard: PolicyChangesWizard;

  /***
   * Subscription wizard
   */
  private subscription: Subscription;

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;

  constructor(
    private policyChangesService: PolicyChangesWizardService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyChangesService.beginPolicyChangesWizardServiceWizard(
      wizard => { this.wizard = wizard; }, this.user, this.currentStep);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
