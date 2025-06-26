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
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { TranslateService } from '@ngx-translate/core';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { ClaimFormFileDocument } from '../claim-form-wizard/entities/claimFormFileDocument';
import { ClaimSubmissionDocumentTypeName } from 'src/app/shared/classes/claimSubmissionDocumentType.enum';



/**
 * This class shows step 2 multi provier of claim submission wizard.
 */
@Component({
  selector: 'app-claim-form-step4',
  templateUrl: './claim-form-step4.component.html'
})
export class ClaimFormStep4Component implements OnInit {

  /**
  * Constant to identify the ClaimSubmissionWizard current step 2
  */
  public currentStep = 5;

  /**
   * ClaimSubmissionWizard object
   */
  public wizard: ClaimFormWizard;

  /**
   * allowed file types
   */
  public allowedTypes: string;

  /**
   * max file size
   */
  public maxFileSize: number;

  /**
   * Documents attachment array
   */
  public documents: Array<any>;

  /**
   * Constant to identify DocType type3
   */
  public type3 = ClaimSubmissionDocumentTypeName.CLAIM_DUCUMENTS;

  /**
   * Constants for the continue process validate message
   */
  private TYPE1 = 'CLAIMSUBMISSION.STEP2TITLE01';

  private TYPE2 = 'CLAIMSUBMISSION.STEP2TITLE02';

  private TYPE3 = 'CLAIMSUBMISSION.STEP2TITLE03';

  private TYPE4 = 'CLAIMSUBMISSION.STEP2TITLE04';

  private UPLOAD_DOCUMENT_MANDATORY_TITLE = 'POLICY.APPLICATION.STEP2.HEALTH_MANDATORY_TITLE';

  private UPLOAD_DOCUMENT_MANDATORY_MESSAGE = 'POLICY.APPLICATION.STEP2.SECTION_MANDATORY_MESSAGE';

  private VALIDATE_CONTINUE = 'POLICY.APPLICATION.STEP2.VALIDATE_CONTINUE';

  private CONTINUE_MESSAGE = 'POLICY.APPLICATION.STEP2.CONTINUE_MESSAGE';

  private CONTINUE_YES = 'APP.BUTTON.YES_BTN';

  private CONTINUE_NO = 'APP.BUTTON.NO_BTN';



  /**
   * Constructor method
   * @param claimSubmissionWizardService Claim Submission Service Injection
   * @param router Router Injection
   * @param notification Notification Service Injection
   * @param configuration Configuration Service Injection
   * @param translate Translate Service Injection
   * @param uploadService UploadService Service Injection
   */
  constructor(
    private claimSubmissionWizardService: ClaimFormWizardService,
    private router: Router,
    private notification: NotificationService,
    private configuration: ConfigurationService,
    private translate: TranslateService,
    private uploadService: UploadService
  ) { }


  /**
   * Executed when the component is initiallized
   */
  ngOnInit() {
    // this.wizard = this.claimSubmissionWizardService.getClaimSubmissionWizard(this.currentStep);
    // this.maxFileSize = this.configuration.claimSubmissionMaxFileSize;
    // this.documents = [];
    // this.documents = this.uploadService.getDocuments();
  }

  /**
   * This Function allows go to back (Step 1).
   */
  back() {
    // this.router.navigate(['claims/claim-submissions/step3']);
    const nextRoute = this.router.url.replace('step5', 'step4');
    this.router.navigate([`${nextRoute}`]);
  }

  cancel() {
    // this.claimSubmissionWizardService.endClaimSubmissionWizard();
    // location.href = '/';
  }

  /**
   * This function route to the next step (Step3).
   */
  async next() {
    this.wizard.documents = this.uploadService.getDocuments();
    const nextRoute = this.router.url.replace('step5', 'step6');
    this.router.navigate([`${nextRoute}`]);
    // if (await this.continueProcess()) {
    //   this.wizard.documents = this.uploadService.getDocuments();
    //   // this.router.navigate(['claims/claim-submissions/step5']);
    //   const nextRoute = this.router.url.replace('step4', 'step5');
    // this.router.navigate([`${nextRoute}`]);
    // }
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
    // let continueProcess = true;

    // continueProcess = await this.showMessageIfWishContinueForCategory(this.type3,
    //   await this.translate.get(this.TYPE3).toPromise(), continueProcess, true);

    // return continueProcess;
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
    const docs = this.claimSubmissionWizardService.getDocumentsByCategory(category);
    if (docs && docs.length > 0) {
      return true;
    }
  }



}
