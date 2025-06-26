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
import { ClaimSubmissionWizard } from '../../claim-submission-wizard/entities/ClaimSubmissionWizard';
import { ClaimSubmissionWizardService } from '../../claim-submission-wizard/claim-submission-wizard.service';
import { Subscription } from 'rxjs';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { TranslateService } from '@ngx-translate/core';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { ClaimSubmissionFileDocument } from '../../claim-submission-wizard/entities/ClaimSubmissionFileDocument';
import { ClaimSubmissionDocumentTypeName } from 'src/app/shared/classes/claimSubmissionDocumentType.enum';



/**
 * This class shows step 2 multi provier of claim submission wizard.
 */
@Component({
  selector: 'app-claim-submission-step2-multi-provider',
  templateUrl: './claim-submission-step2-multi-provider.component.html'
})
export class ClaimSubmissionStep2MultiProvicerComponent implements OnInit, OnDestroy {

  /**
  * Constant to identify the ClaimSubmissionWizard current step 2
  */
  public currentStep = 2;

  /**
   * Subscription
   */
  private subscription: Subscription;

  /**
   * ClaimSubmissionWizard object
   */
  public wizard: ClaimSubmissionWizard;

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
   * Constant to identify DocType type1
   */
  public type1 = ClaimSubmissionDocumentTypeName.CLAIM_BILL;

  /**
   * Constant to identify DocType type2
   */
  public type2 = ClaimSubmissionDocumentTypeName.MEDICAL_RECORDS;

  /**
   * Constant to identify DocType type3
   */
  public type3 = ClaimSubmissionDocumentTypeName.BANK_INFORMATION;

  /**
   * Constant to identify DocType type4
   */
  public type4 = ClaimSubmissionDocumentTypeName.CLAIM_DUCUMENTS;


  /**
   * Constants for the continue process validate message
   */
  private TYPE1 = 'CLAIMSUBMISSION.STEP2TITLE01';

  private TYPE2 = 'CLAIMSUBMISSION.STEP2TITLE02';

  private TYPE3 = 'CLAIMSUBMISSION.STEP2TITLE03';

  private TYPE4 = 'CLAIMSUBMISSION.STEP2TITLE04';

  private UPLOAD_DOCUMENT_MANDATORY_TITLE = 'POLICY.APPLICATION.STEP2.HEALTH_MANDATORY_TITLE';

  private UPLOAD_DOCUMENT_MANDATORY_MESSAGE = 'POLICY.APPLICATION.STEP2.SECTION_MANDATORY_MESSAGE';

  private UPLOAD_DOCUMENT_WARNING_TITLE = 'POLICY.APPLICATION.STEP2.HEALTH_WARNING_TITLE';

  private UPLOAD_DOCUMENT_WARNING_MESSAGE = 'POLICY.APPLICATION.STEP2.SECTION_WARNING_MESSAGE';

  private UPLOAD_DOCUMENT_MANDATORY_MESSAGE_ONLYXML = 'POLICY.APPLICATION.STEP2.SECTION_MANDATORY_MESSAGE_ONLYXML';

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
    private claimSubmissionWizardService: ClaimSubmissionWizardService,
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
    this.subscription = this.claimSubmissionWizardService.beginClaimSubmissionWizard(
      wizard => this.wizard = wizard, this.currentStep);
    this.maxFileSize = this.configuration.claimSubmissionMaxFileSize;
    this.documents = [];
    this.documents = this.uploadService.getDocuments();
  }

  /**
   * Executed when the component is destroyed and free subscriptions
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * This Function allows go to back (Step 1).
   */
  back() {
    // this.router.navigate(['claims/claim-submission/step1']);
    const nextRoute = this.router.url.replace('step2', 'step1');
    this.router.navigate([`${nextRoute}`]);
  }

  /**
   * This function route to the next step (Step3).
   */
  async next() {
    if (await this.continueProcess()) {
      this.wizard.documents = this.uploadService.getDocuments();
      // this.router.navigate(['claims/claim-submission/step3']);
      const nextRoute = this.router.url.replace('step2', 'step3');
      this.router.navigate([`${nextRoute}`]);
    }
  }

  /**
   * This function allows remove a single upload file.
   * @param document File to remove.
   * @param e parameter to specify a component to remove file.
   */
  removeDocument(document: ClaimSubmissionFileDocument, e) {
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
    let continueProcess = true;

    continueProcess = await this.showMessageIfWishContinueForCategory(this.type1,
      await this.translate.get(this.TYPE1).toPromise(), continueProcess, true);
    continueProcess = await this.showMessageIfWishContinueForCategory(this.type2,
      await this.translate.get(this.TYPE2).toPromise(), continueProcess, false);
    continueProcess = await this.showMessageIfWishContinueForCategory(this.type3,
      await this.translate.get(this.TYPE3).toPromise(), continueProcess, false);
    continueProcess = await this.showMessageIfWishContinueForCategory(this.type4,
      await this.translate.get(this.TYPE4).toPromise(), continueProcess, false);

    return continueProcess;
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
    else if(this.isClaimFromMexico() && continueProcess){
      if(category == this.type1 && this.checkHowManyXMLDocumentsByCategory(category) == 0){
        const msg = await this.translate.get(this.UPLOAD_DOCUMENT_MANDATORY_MESSAGE_ONLYXML).toPromise();
        await this.notification.showDialog(this.UPLOAD_DOCUMENT_MANDATORY_TITLE,
          msg.toString().replace('{0}', categoryname));
        return false;
      }
      else if(category == this.type1 && this.checkHowManyXMLDocumentsByCategory(category) > 1){
        const msg = await this.translate.get(this.UPLOAD_DOCUMENT_WARNING_MESSAGE).toPromise();
        await this.notification.showDialog(this.UPLOAD_DOCUMENT_WARNING_TITLE,msg);
        return false;
      }
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

  /**
   * Validate if the actual claim process is from Mexico.
   */
  isClaimFromMexico(){
    return this.wizard.countryOfServiceId == 13 && (this.wizard.member.insuranceBusinessId == 41)
  }

  /**
   * Checks how many XML documents there are by type in array.
   */
  checkHowManyXMLDocumentsByCategory(category) {
    let count = 0;
    this.documents.forEach(doc => {
        if(doc.file.type == "text/xml" && doc.category == category){
          count = count + 1;
        }
    })
    return count;
  }

}
