/**
* policy-enrollment-step4.component.ts
*
* @description: This class handle step  policy aplication wizard.
* @author Enrique Durango.
* @version 1.0
* @date 06-12-2019.
*
**/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyEnrollmentWizardService } from '../../../policy-enrollment-wizard/policy-enrollment-wizard.service';
import { Subscription } from 'rxjs';
import { PolicyEnrollmentWizard } from '../../../policy-enrollment-wizard/entities/policy-enrollment-wizard';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Utilities } from 'src/app/shared/util/utilities';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';

@Component({
  selector: 'app-policy-enrollment-step4',
  templateUrl: './policy-enrollment-step4.component.html'
})
export class PolicyEnrollmentStep4Component implements OnInit, OnDestroy {

  /**
   * Current step of policy enrollment step4 component
   */
  public CURRENT_STEP = 4;
  /**
   * User  of policy enrollment step4 component
   */
  public user: UserInformationModel;
  /**
   * Wizard  of policy enrollment step4 component
   */
  public wizard: PolicyEnrollmentWizard;
  /**
   * Section active of policy enrollment step4 component
   */
  public sectionActive: number;
    /**
   * Constant for time to delay (ms)
   */
  private TIME_TO_DELAY = 10;
  /**
   * Subscription  of policy enrollment step4 component
   */
  private subscription: Subscription;
  private totalSectionPanama = 4;
  private totalSectionMexico = 5;
  /**
   * Creates an instance of policy enrollment step4 component.
   * @param policyEnrollmentWizardService
   * @param authService
   */
  constructor(private policyEnrollmentWizardService: PolicyEnrollmentWizardService,
    private authService: AuthService
  ) { }

  /**
   * on destroy
   */
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  /**
   * on init
   */
  async ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.policyEnrollmentWizardService.beginPolicyEnrollmentWizard(
      (wizard: PolicyEnrollmentWizard) => {
        this.wizard = wizard;
        this.setSectionStep(this.wizard.currentSection);
      },
      this.user, null, this.CURRENT_STEP, 0);
  }


    /**
   * Establish step to current step
   * @param step Step number
   */
  async setSectionStep(step: number) {
    await Utilities.delay(this.TIME_TO_DELAY);
    this.sectionActive = step;
  }

  isStepsValids() {
    if (this.sectionActive === 2 || this.sectionActive === 3 || this.sectionActive === 4) {
      return true;
    }
  }

  getTotalStep() {
    if (+this.user.bupa_insurance === InsuranceBusiness.BUPA_PANAMA) {
      if (this.sectionActive === 2 || this.sectionActive === 3) {
        return this.totalSectionPanama;
      }
    } else {
      if (this.sectionActive === 2 || this.sectionActive === 3 || this.sectionActive === 4) {
        return this.totalSectionMexico;
      }
    }

  }

}
