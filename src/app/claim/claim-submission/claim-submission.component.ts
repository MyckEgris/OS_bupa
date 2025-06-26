/**
* Claim-submission.component.ts
*
* @description: This class shows agreement and claim submission wizard.
* @author Yefry Lopez.
* @version 1.0
* @date 01-10-2018.
*
**/
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AgreementService } from 'src/app/main/services/agreement/agreement.service';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { ClaimSubmissionWizard } from './claim-submission-wizard/entities/ClaimSubmissionWizard';
import { ClaimSubmissionWizardService } from './claim-submission-wizard/claim-submission-wizard.service';
import { Subscription } from 'rxjs';
import { Utilities } from 'src/app/shared/util/utilities';
import { AgentService } from 'src/app/shared/services/agent/agent.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { Rol } from 'src/app/shared/classes/rol.enum';



/**
 * This class shows agreement and claim submisiion wizard.
 */
@Component({
  selector: 'app-claim-submission',
  templateUrl: './claim-submission.component.html'
})
export class ClaimSubmissionComponent implements OnInit, OnDestroy {

  /**
   * ClaimSubmissionWizard Object
   */
  public wizard: ClaimSubmissionWizard;

  /**
   * Flag for result of accept the agreement
   */
  public agreementAccepted: boolean;

  /**
   * Current step indicator
   */
  public currentStep: number;

  /**
   * roleName
   */
  public roleName: string;

  /**
   * Subscription
   */
  private subscription: Subscription;

  /**
   * Html file for agreement content
   */
  private SUBMISSION_AGREEMENT_CONTENT = 'Agreement_ClaimSubmission.html';

  /**
   * Agreement title
   */
  private SUBMISSION_AGREEMENT_TITLE = 'CLAIMSUBMISSION.AGREEMENTCLAIMSUBTITLE';

  /**
   * Agent validate title
   */
  private VALIDATE_AGENT_TITLE = 'CLAIMSUBMISSION.STEP1VALIDATEAGENTTITLE';

  /**
   * Agent validate message
   */
  private VALIDATE_AGENT_MESSAGE = 'CLAIMSUBMISSION.STEP1VALIDATEAGENTMESSAGE';

  /**
   * Constant for time to delay (ms)
   */
  private TIME_TO_DELAY = 10;

  /**
   * user
   */
  private user: any;

  /**
   * User Rol enum
   */
  public rol = Rol;

  /**
   * Flag for step1 agent user
   */
  public userAgent = false;

  /**
   * Flag for step1 member user
   */
  public userMember = false;

  /**
   * Flag for step1 provider user
   */
  public userProvider = false;




  /**
   * Constructor Method
   * @param claimSubmissionWizardService Claim Submission Service Injection
   * @param agreementService Agreement Service Injection
   * @param translationService Translation Service Injection
   * @param router Router Injection
   */
  constructor(
    private claimSubmissionWizardService: ClaimSubmissionWizardService,
    private agreementService: AgreementService,
    private translationService: TranslationService,
    private router: Router,
    private agentService: AgentService,
    private auth: AuthService,
    private notification: NotificationService,
    private configurationService: ConfigurationService) { }




  /**
   * Initialize subscription for start wizard in current step.
   * Open agreement window for claim submission agreement and wait for affirmative response or open again
   */
  async ngOnInit() {
    this.user = this.auth.getUser();
    this.handleUser();
    this.roleName = this.user.role;
    this.subscription = this.claimSubmissionWizardService.beginClaimSubmissionWizard(wizard => {
      this.wizard = wizard;
      this.setStep(this.wizard.currentStep);
    });
    const data = await this.agreementService.getHtmlAgreement(this.selectLanguageAgreement());
    this.agreementAccepted = await this.agreementService.showCustomAgreementsDialog(data, this.SUBMISSION_AGREEMENT_TITLE);
    if (!this.agreementAccepted) {
      location.href = this.configurationService.returnUrl;
    }
  }

  /**
   * Ends subscription to wizard subject
   */
  ngOnDestroy() {
    if (this.subscription) { this.subscription.unsubscribe(); }
    this.claimSubmissionWizardService.endClaimSubmissionWizard();
  }

  /**
   *  Select language to show Agreement.
   */
  selectLanguageAgreement() {
    const language = this.translationService.getLanguage();
    return `./assets/agreements/${language.toLowerCase()}/${this.SUBMISSION_AGREEMENT_CONTENT}`;
  }

  /**
   * This Function allow route to specify step in the claim submission wizard.
   * @param step Step to route claims submission wizard.
   */
  goToStep(step) {
    this.router.navigate(['claims/claim-submission/step' + step]);
  }

  /**
   * Establish step to current step
   * @param step Step number
   */
  async setStep(step: number) {
    await Utilities.delay(this.TIME_TO_DELAY);
    this.currentStep = step;
  }

  /**
   * Handle step1 sub step according user rol.
   */
  handleUser() {

    if (this.user.role_id === String(this.rol.AGENT) ||
      this.user.role_id === String(this.rol.AGENT_ASSISTANT) ||
      this.user.role_id === String(this.rol.GROUP_ADMIN)) {
      this.userAgent = true;
    }

    if (this.user.role_id === String(this.rol.PROVIDER)) {
      this.userProvider = true;
    }

    if (this.user.role_id === String(this.rol.POLICY_HOLDER) ||
      this.user.role_id === String(this.rol.GROUP_POLICY_HOLDER)) {
      this.userMember = true;
    }

  }


}
