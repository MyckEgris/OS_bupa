/**
* Claim-submission-step2-multi-provider.component.ts
*
* @description: This class shows step 2 of claim submission wizard for multi provider option.
* @author Yefry Lopez.
* @author Jose Daniel Hernnandez M.
* @version 1.0
* @date 01-10-2018.
* @version 2.0
* @date 13-04-2020.
*
*/


import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ClaimFormWizard } from '../claim-form-wizard/entities/ClaimFormWizard';
import { ClaimFormWizardService } from '../claim-form-wizard/claim-form-wizard.service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { TranslateService } from '@ngx-translate/core';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { ClaimFormFileDocument } from '../claim-form-wizard/entities/claimFormFileDocument';
import { ClaimSubmissionDocumentTypeName } from 'src/app/shared/classes/claimSubmissionDocumentType.enum';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Currency } from 'src/app/shared/services/common/entities/currency';
import { FormGroup } from '@angular/forms';
import { ClaimSubmissionFileTypeName } from 'src/app/shared/classes/claimSubmissionFileTypeName';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { PolicyHelperService } from 'src/app/shared/services/policy-helper/policy-helper.service';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PolicyNatureId } from 'src/app/shared/classes/policy-nature.enum';



/**
 * This class shows step 2 multi provier of claim submission wizard.
 */
@Component({
  selector: 'app-claim-form-step3',
  templateUrl: './claim-form-step3.component.html'
})
export class ClaimFormStep3Component implements OnInit, OnDestroy {

  /***
  * variable by value keyboard_arrow_down
  */
  private ARROW_DIRECTION_DOWN = 'keyboard_arrow_down';

  /***
   * variable by value keyboard_arrow_up
   */
  private ARROW_DIRECTION_UP = 'keyboard_arrow_up';

  /***
   * variable by value CLASS_FRAME_HELP_NON_BORDER
   */
  private CLASS_FRAME_HELP_NON_BORDER = 'bp-section bp-section_shadow mb-3';

  /***
   * variable by value CLASS_FRAME_HELP_BORDER
   */
  private CLASS_FRAME_HELP_BORDER = 'bp-section bp-section_shadow mb-3 bp-border bp-border-color_primary bp-border-width--2px';

  /**
   * Constants for the continue process validate message
   */
  private TYPE1 = 'CLAIMSUBMISSION.STEP2TITLE01';

  private TYPE2 = 'CLAIMSUBMISSION.STEP2TITLE02';

  private TYPE3 = 'CLAIMSUBMISSION.STEP2TITLE03';

  private TYPE4 = 'CLAIMSUBMISSION.STEP2TITLE04';

  private UPLOAD_DOCUMENT_MANDATORY_TITLE = 'POLICY.APPLICATION.STEP2.HEALTH_MANDATORY_TITLE';

  private UPLOAD_DOCUMENT_MANDATORY_MESSAGE = 'CLAIMFORM.APPLICATION.STEP2.HEALTH_MANDATORY_MESSAGE';

  private VALIDATE_CONTINUE = 'POLICY.APPLICATION.STEP2.VALIDATE_CONTINUE';

  private CONTINUE_MESSAGE = 'POLICY.APPLICATION.STEP2.CONTINUE_MESSAGE';

  private CONTINUE_YES = 'APP.BUTTON.YES_BTN';

  private CONTINUE_NO = 'APP.BUTTON.NO_BTN';

  /**
  * Constant to identify the ClaimSubmissionWizard current step 2
  */
  public currentStep = 4;

  /**
   * ClaimSubmissionWizard object
   */
  public wizard: ClaimFormWizard;

  /**
  * Wizard Subscription.
  */
  public subWizard: Subscription;

  /**
   * Countries instance.
   */
  public currencies: Currency[] = [];

  /**
   * allowed file types
   */
  public allowedTypes: string;

  /**
   * max file size
   */
  public maxFileSize: number;

  /**
   * file types
   */
  public fileTypes = ClaimSubmissionFileTypeName.CLAIM_SUBM_DEFAULT;

  /**
   * Documents attachment array
   */
  public documents: Array<any>;

  public showValidations: any;

  public policySearchTypes: any;

  /**
   * Constant to identify DocType claimBillType
   */
  public type2 = ClaimSubmissionDocumentTypeName.CLAIM_BILL;

  /***
   * variable changeArrowMedicalEvents
   */
  public changeArrowMedicalEvents: string = this.ARROW_DIRECTION_UP;

  /***
   * variable changeArrowNonMedicalEvents
   */
  public changeArrowNonMedicalEvents: string = this.ARROW_DIRECTION_DOWN;

  /***
  * variable changeArrowCancelations
  */
  public changeArrowCancelations: string = this.ARROW_DIRECTION_DOWN;

  /***
  * variable classFrameHelp
  */
  public classFrameHelp: string = this.CLASS_FRAME_HELP_NON_BORDER;

  /***
  * variable clickFrameHelp
  */
  public clickFrameHelp: Boolean = false;

  /**
 * Show Error
 */
  showError: Boolean = false;

  public user: UserInformationModel;

  /**
   * Constructor method
   * @param claimFormWizardService Claim Submission Service Injection
   * @param router Router Injection
   * @param notification Notification Service Injection
   * @param configuration Configuration Service Injection
   * @param translate Translate Service Injection
   * @param uploadService UploadService Service Injection
   * @param _commonService Currencies Injection
   */
  constructor(
    private claimFormWizardService: ClaimFormWizardService,
    private router: Router,
    private notification: NotificationService,
    private configuration: ConfigurationService,
    private translate: TranslateService,
    private _commonService: CommonService,
    private uploadService: UploadService,
    private policyHelper: PolicyHelperService,
    private authService: AuthService
  ) { }

  /**
  * Ends the component operation.
  */
  ngOnDestroy() {
    if (this.subWizard) {
      this.subWizard.unsubscribe();
    }
  }

  /**
   * Executed when the component is initiallized
   */
  ngOnInit() {
    this.user = this.authService.getUser();
    this.subWizard = this.claimFormWizardService.beginWizard(
      wizard => { this.wizard = wizard; }, this.currentStep
    );
    this.maxFileSize = this.configuration.claimSubmissionMaxFileSize;
    this.documents = [];
    this.documents = this.uploadService.getDocuments();
    this.getCurrencies();
  }

  /**
   * This Function allows go to back (Step 1).
   */
  back() {
    const nextRoute = this.router.url.replace('step4', 'step3');
    this.router.navigate([`${nextRoute}`]);
  }

  cancel() {
    this.router.navigate(['']);
  }

  /**
   * This function route to the next step (Step3).
   */
  async next() {
    if (await this.continueProcess()) {
      this.wizard.documents = this.uploadService.getDocuments();
      const nextRoute = this.router.url.replace('step4', 'step5');
      this.router.navigate([`${nextRoute}`]);
    }
  }

  /**
   * This function allows remove a single upload file.
   * @param document File to remove.
   * @param e parameter to specify a component to remove file.
   */
  removeDocument(document: ClaimFormFileDocument, e) {
    this.uploadService.remove(document);
    this.documents = this.uploadService.getDocuments();
    e.preventDefault();
  }

  /**
   * Checks if there are any document by type in array.
   */
  checkIfHaveDocumentsByCategory(category) {
    return this.documents.find(d => d.category === category);
  }

  /**
   * Validates if user wants to continue whit the process.
   */
  async continueProcess() {
    if (this.handleIsTravelPolicy) {
      return true;
    } else {
      let continueProcess = true;
      continueProcess = await this.showMessageIfWishContinueForCategory(this.type2,
        await this.translate.get(this.TYPE2).toPromise(), continueProcess, true);
      return continueProcess;
    }
  }

  /**
   * Shows process continue validation message.
   */
  async showMessageIfWishContinueForCategory(category, categoryname, continueProcess, isMandatory) {
    if (!this.checkIfHaveDocumentsByCategory(category) && continueProcess) {
      if (isMandatory) {
        const msg = await this.translate.get(this.UPLOAD_DOCUMENT_MANDATORY_MESSAGE).toPromise();
        await this.notification.showDialog(this.UPLOAD_DOCUMENT_MANDATORY_TITLE,
          msg.toString().replace('{0}', categoryname));
        return false;
      }
      const title = await this.translate.get(this.VALIDATE_CONTINUE).toPromise();
      const message = await this.translate.get(this.CONTINUE_MESSAGE).toPromise();
      const yes = await this.translate.get(this.CONTINUE_YES).toPromise();
      const no = await this.translate.get(this.CONTINUE_NO).toPromise();
      continueProcess = await this.notification.showDialog(title.toString().replace('{0}', categoryname),
        message.toString().replace('{0}', categoryname), true, yes, no);
    }
    return continueProcess;
  }

  /**
   * Handle the documents length.
   * @param category Category.
   */
  handleDocumentLength(category: string) {
    const docs = this.claimFormWizardService.getDocumentsByCategory(category);
    if (docs && docs.length > 0) {
      return true;
    }
  }

  /**
  * Loads countries for charge the select option
  */
  getCurrencies() {
    this._commonService.getCurrencies().subscribe(
      result => {
        this.currencies = result;
        if (!this.wizard.currencyId) {
          this.wizard.currencyId = 192;
          const currencyCode = this.currencies.find(x => x.currencyId === 192);
          this.wizard.currencyCode = currencyCode.currencyCode;
        }
      },
      error => {
        if (error.error.code) {
          this.showErrorMessage(error);
        }
      }
    );
  }

  /**
   * This Function allow select a currency to create and associate a claim.
   * @param currencyCode
   */
  selectCurrency(event, currencyValue: number) {
    const currencyCode = this.currencies.find(x => x.currencyId === Number(currencyValue));
    this.wizard.currencyCode = currencyCode.currencyCode;
  }

  /**
    * Shows an error message.
    * @param errorMessage error message that will be shown.
    */
  private showErrorMessage(errorMessage: HttpErrorResponse) {
    let message = '';
    let messageTitle = '';
    this.translate.get(`AGENT.PROFILE.ERROR_CODE.${errorMessage.error.code}`).subscribe(
      result => message = result
    );
    this.translate.get(`AGENT.PROFILE.ERROR_MESSAGE.${errorMessage.error.code}`).subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);

  }

  /**
   * Function to collapse accordion medical events
   * @param toggleArrow direction
   */
  toggleMedicalEvents(toggleArrow: string) {
    if (toggleArrow === this.ARROW_DIRECTION_DOWN) {
      this.changeArrowMedicalEvents = this.ARROW_DIRECTION_UP;
    } else {
      this.changeArrowMedicalEvents = this.ARROW_DIRECTION_DOWN;
    }
  }

  /**
   * Function to collapse accordion non medical events
   * @param toggleArrow direction
   */
  toggleNonMedicalEvents(toggleArrow: string) {
    if (toggleArrow === this.ARROW_DIRECTION_DOWN) {
      this.changeArrowNonMedicalEvents = this.ARROW_DIRECTION_UP;
    } else {
      this.changeArrowNonMedicalEvents = this.ARROW_DIRECTION_DOWN;
    }
  }

  /**
   * Function to collapse accordion cancelations
   * @param toggleArrow direction
   */
  toggleCancelations(toggleArrow: string) {
    if (toggleArrow === this.ARROW_DIRECTION_DOWN) {
      this.changeArrowCancelations = this.ARROW_DIRECTION_UP;
    } else {
      this.changeArrowCancelations = this.ARROW_DIRECTION_DOWN;
    }
  }

  /**
   * Function clickChangeFrameHelp
   */
  clickChangeFrameHelp() {
    this.classFrameHelp = this.CLASS_FRAME_HELP_BORDER;
    setInterval(() => {
      this.classFrameHelp = this.CLASS_FRAME_HELP_NON_BORDER;
    }, 10000);
  }

  /**
   * Role is PolicyMember
   */
   public get handleIsPolicyMember(): boolean {
    return (this.user.role_id === String(Rol.POLICY_MEMBER));
  }

  /**
 * Is Travel Policy
 */
   public get handleIsTravelPolicy(): boolean {
    const policyNatureId = this.wizard.policyHolder.policyNatureId;
    const policyNatureIds: number[] = [PolicyNatureId.TRAVELBTI, PolicyNatureId.TRAVEL];
    return (policyNatureIds.includes(policyNatureId));
  }  

  /**
 * Is BTI Policy
 */
   public get handleIsBTIPolicy(): boolean {
    const policyNatureId = this.wizard.policyHolder.policyNatureId;
    const policyNatureIds: number[] = [PolicyNatureId.TRAVELBTI];
    return (policyNatureIds.includes(policyNatureId));
  } 

  /**
   * Role is Agent or Agent Assistant
   */
   public get handleIsAgent(): boolean {
    const rolesIds = [Rol.AGENT, Rol.AGENT_ASSISTANT];
    return (rolesIds.includes(Number(this.user.role_id)));
  }
}
