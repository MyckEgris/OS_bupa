/**
* ClaimFormStep1Component.ts
*
* @description: This class shows step 1 of claim form wizard.
*
*/


import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { ClaimFormWizard } from '../claim-form-wizard/entities/ClaimFormWizard';
import { ClaimFormWizardService } from '../claim-form-wizard/claim-form-wizard.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Rol } from 'src/app/shared/classes/rol.enum';

import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { AgreementService } from 'src/app/shared/services/agreement/agreement.service';
import { UploadService } from 'src/app/shared/upload/upload.service';

/**
 * This class shows step 1 of claim form wizard.
 */
@Component({
  selector: 'app-claims-form-step1',
  templateUrl: './claim-form-step1.component.html'
})
export class ClaimFormStep1Component implements OnInit, OnDestroy {

  /**
  * Constant to identify the ClaimSubmissionWizard current step 1
  */
  public currentStep = 1;

  /**
   * ClaimSubmissionWizard Object
   */
  public wizard: ClaimFormWizard;

  /**
  * Wizard Subscription.
  */
  public subWizard: Subscription;

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
  * Html file for agreement content
  */
  private SUBMISSION_AGREEMENT_CONTENT = 'Agreement_ClaimSubmission.html';

  /**
  * Agreement title
  */
  private SUBMISSION_AGREEMENT_TITLE = 'CLAIMSUBMISSION.AGREEMENTCLAIMSUBTITLE';

  /**
  * Agreement Message to check
  */
  private MESSAGETOCHECK = 'CLAIMSUBMISSION.MESSAGETOCHECK';


  /**
   * Constructor Method
   * @param claimFormWizardService Claim Submission Service Injection
   * @param authService Auth Service Injection
   * @param agreementService Agreement Service Injection
   * @param translationService Translation Service Injection
   */
  constructor(
    private claimFormWizardService: ClaimFormWizardService,
    private authService: AuthService,
    private agreementService: AgreementService,
    private configurationService: ConfigurationService,
    private translationService: TranslationService,
    private uploadService: UploadService,

  ) { }

  /**
  * Ends the component operation.
  */
  ngOnDestroy() {
    if (this.subWizard) { this.subWizard.unsubscribe(); }
  }

  /**
   * Initialize component. Get user information from redux store
   */
  ngOnInit() {
    this.claimFormWizardService.removeClaimAll();
    this.uploadService.removeAllFiles();
    this.user = this.authService.getUser();
    this.subWizard = this.claimFormWizardService.beginWizard(
      wizard => { this.wizard = wizard; }, this.currentStep
    );
    this.handleAgreement();
  }

  /**
  * Open agreement window for claim submission agreement and wait for affirmative response or open again
  */
  async handleAgreement() {
    if (this.wizard) {
      if (!this.wizard.agreementAccepted) {
        const data = await this.agreementService.getHtmlAgreement(this.selectLanguageAgreement());
        const response = await this.agreementService.showCustomAgreementsDialog(data, this.SUBMISSION_AGREEMENT_TITLE, "", this.MESSAGETOCHECK);
        this.wizard.agreementAccepted = response;
        if (!response) {
          location.href = this.configurationService.returnUrl;
        } else {
          this.handleStep1SubStep();
        }
      } else {
        this.handleStep1SubStep();
      }
    }
  }

  /**
   *  Select language to show Agreement.
   */
  selectLanguageAgreement() {
    const language = this.translationService.getLanguageId() === 1? 'ENG': 'SPA';
    return `./assets/agreements/${language.toLowerCase()}/${this.SUBMISSION_AGREEMENT_CONTENT}`;
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
    if (this.user.role_id === String(this.rol.POLICY_HOLDER) ||
      this.user.role_id === String(this.rol.GROUP_POLICY_HOLDER) ||
      this.user.role_id === String(this.rol.POLICY_MEMBER)) {
      this.subStepMember = true;
    }
  }

}
