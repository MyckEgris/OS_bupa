/**
* ClaimSubmissionStep1Component.ts
*
* @description: This class shows step 1 of claim submission wizard.
* @author Harold Robbins V.
* @author Jose Daniel Hernandez M.
* @version 1.0
* @date 01-10-2018.
* @version 2.0
* @date 16-04-2020.
*
*/


import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { ClaimSubmissionWizard } from '../claim-submission-wizard/entities/ClaimSubmissionWizard';
import { ClaimSubmissionWizardService } from '../claim-submission-wizard/claim-submission-wizard.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Rol } from 'src/app/shared/classes/rol.enum';


/**
 * This class shows step 1 of claim submission wizard.
 */
@Component({
  selector: 'app-claim-submission-step1',
  templateUrl: './claim-submission-step1.component.html'
})
export class ClaimSubmissionStep1Component implements OnInit, OnDestroy {

  /**
  * Constant to identify the ClaimSubmissionWizard current step 2
  */
  public currentStep = 1;

  /**
   * ClaimSubmissionWizard Object
   */
  public wizard: ClaimSubmissionWizard;

  /**
   * Subscription
   */
  private subscription: Subscription;

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;

  /**
   * Flag for step1 agent subStep
   */
  public subStepAgent = false;

  /**
   * Flag for step1 member subStep
   */
  public subStepMember = false;

  /**
   * Flag for step1 provider subStep
   */
  public subStepProvider = false;

  /**
   * User Rol enum
   */
  public rol = Rol;


  /**
   * Constructor Method
   * @param claimSubmissionWizardService Claim Submission Service Injection
   * @param authService Auth Service Injection
   */
  constructor(
    private claimSubmissionWizardService: ClaimSubmissionWizardService,
    private authService: AuthService
  ) { }


  /**
   * Initialize component. Get user information from redux store
   */
  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.claimSubmissionWizardService.beginClaimSubmissionWizard(
      wizard => this.wizard = wizard, this.currentStep
    );
    this.handleStep1SubStep();
  }

  /**
   * Destroy subscription
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * Handle step1 sub step according user rol.
   */
  handleStep1SubStep() {

    if (this.user.role_id === String(this.rol.AGENT) ||
      this.user.role_id === String(this.rol.AGENT_ASSISTANT) ||
      this.user.role_id === String(this.rol.GROUP_ADMIN)) {
      this.subStepAgent = true;
    }

    if (this.user.role_id === String(this.rol.PROVIDER)) {
      this.subStepProvider = true;
    }

    if (this.user.role_id === String(this.rol.POLICY_HOLDER) ||
      this.user.role_id === String(this.rol.GROUP_POLICY_HOLDER)) {
      this.subStepMember = true;
    }

  }

}
