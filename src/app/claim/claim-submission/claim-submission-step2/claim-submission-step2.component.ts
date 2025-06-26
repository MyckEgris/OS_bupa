import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { ClaimSubmissionWizard } from '../claim-submission-wizard/entities/ClaimSubmissionWizard';
import { ClaimSubmissionWizardService } from '../claim-submission-wizard/claim-submission-wizard.service';

@Component({
  selector: 'app-claim-submission-step2',
  templateUrl: './claim-submission-step2.component.html'
})
export class ClaimSubmissionStep2Component implements OnInit, OnDestroy {

  /**
   * Constant to identify the ClaimSubmissionWizard current step 2
   */
  public currentStep = 2;

  /**
   * ClaimSubmissionWizard object
   */
  public wizard: ClaimSubmissionWizard;

  /***
   * Subscription wizard
   */
  private subscription: Subscription;

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;

  /***
   * Const to Identify the single_provider sub step component
   */
  public STEP2_SINGLE_PROVIDER = 'single_provider';

  /***
   * Const to Identify the multi_provider sub step component
   */
  public STEP2_MULTI_PROVIDER = 'multi_provider';


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
    // this.wizard.currentSubStep = 'multi_provider';
  }

  /**
   * Destroy subscription
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
