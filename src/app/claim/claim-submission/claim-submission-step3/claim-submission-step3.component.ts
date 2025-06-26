/**
* Claim-submission-step3.component.ts
*
* @description: This class shows step 3 of claim submission wizard.
* @author Harold Robbins V.
* @author Yefry Lopez
* @author Juan Camilo Moreno
* @version 1.0
* @date 01-10-2018.
*
**/

import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { ClaimSubmissionWizard } from '../claim-submission-wizard/entities/ClaimSubmissionWizard';
import { ClaimSubmissionWizardService } from '../claim-submission-wizard/claim-submission-wizard.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { ProviderService } from 'src/app/shared/services/provider/provider.service';
import { ClaimSubmissionService } from 'src/app/shared/services/claim-submission/claim-submission.service';
import { FileHelper } from 'src/app/shared/util/file-helper';
import { TranslateService } from '@ngx-translate/core';
import { async } from '@angular/core/testing';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { ClaimSubmissionModel } from 'src/app/shared/services/claim-submission/entities/ClaimSubmissionModel';
import { DateTranslatePipe } from 'src/app/shared/pipes/date-translate/date-translate.pipe';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { FileDocument } from 'src/app/shared/services/common/entities/fileDocument';
import { ClaimSubmissionDocumentTypeName } from 'src/app/shared/classes/claimSubmissionDocumentType.enum';
import { Rol } from 'src/app/shared/classes/rol.enum';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';


/**
 *  This class shows step 3 of claim submission wizard.
 */
@Component({
  selector: 'app-claim-submission-step3',
  templateUrl: './claim-submission-step3.component.html'
})
export class ClaimSubmissionStep3Component implements OnInit, OnDestroy, OnChanges {

  /**
  * Constant to identify the ClaimSubmissionWizard current step 2
  */
  public currentStep = 3;

  /**
   * Subscription
   */
  private subscription: Subscription;

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;

  /**
   * ClaimSubmissionWizard Object
   */
  public wizard: ClaimSubmissionWizard;

  /**
   * dateTranslate
   */
  private dateTranslate: DateTranslatePipe;

  /**
   * fileScroll to access native element in DOM
   */
  @ViewChild('fileScroll') fileScroll;

  /**
   * fileScroll to access native element in DOM
   */
  @ViewChild('fileScrollTwo') fileScrollTwo;

  /**
   * fileScroll to access native element in DOM
   */
  @ViewChild('fileScrollTree') fileScrollTree;

  /**
   * fileScroll to access native element in DOM
   */
  @ViewChild('fileScrollFour') fileScrollFour;

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
   * Const to Identify the single_provider sub step component
   */
  public STEP2_SINGLE_PROVIDER = 'single_provider';

  /**
   * Const to Identify the multi_provider sub step component
   */
  public STEP2_MULTI_PROVIDER = 'multi_provider';

  /**
   * User Rol enum
   */
  public rol = Rol;



  /**
   * Constructor Method
   * @param claimSubmissionWizardService Claim Submission Wizard Service Injection
   * @param claimSubmissionService Claim Submission Service Injection
   * @param router Router Injection
   * @param notificationService Notification Service Injection
   * @param commonService Common Service Injection
   * @param providerService Provider Service Injection
   * @param translate Translate Service Injection
   * @param translation Translation Service Injection
   * @param _ref _ref Service Injection
   * @param configurationService configuration Service Injection
   * @param authService Auth Service Injection
   */
  constructor(
    private claimSubmissionWizardService: ClaimSubmissionWizardService,
    private claimSubmissionService: ClaimSubmissionService,
    private router: Router,
    private notificationService: NotificationService,
    private commonService: CommonService,
    private providerService: ProviderService,
    private translate: TranslateService,
    private translation: TranslationService,
    private _ref: ChangeDetectorRef,
    private configurationService: ConfigurationService,
    private authService: AuthService
  ) {
    this.dateTranslate = new DateTranslatePipe(this.translate, this._ref);
  }



  /**
   * Initialize subscription and generate guids
   */
  ngOnInit() {
    this.user = this.authService.getUser();
    this.subscription = this.claimSubmissionWizardService.beginClaimSubmissionWizard(
      wizard => this.wizard = wizard, this.currentStep
    );
    this.hadleFileScroll();
  }

  ngOnChanges() {
    this.hadleFileScroll();
  }

  /**
   * Destroy subscription
   */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  /**
 * This fucntion allows calculate the size of a upload file.
 * @param file file to calculate size.
 */
  getFileSize(file) {
    return FileHelper.calculateFileSize(file);
  }

  /**
   * This Function allows go to back (Step 2).
   */
  back() {
    // this.router.navigate(['claims/claim-submission/step2']);
    const nextRoute = this.router.url.replace('step3', 'step2');
    this.router.navigate([`${nextRoute}`]);
  }

  /**
   * Submit Step 3 to claim submission service with claims, documents and folders
   */
  async submit() {
    try {
      let claimGuid: string;
      await this.commonService.newGuidNuevo().subscribe(g => {
        claimGuid = g;
      }, e => console.error(e)
      );
      const response = await this.commonService.uploadFirstDocument(this.wizard.documents[0]);
      this.wizard.folderName = response.folderName;
      if (this.wizard.documents.length > 1) {
        for (let index = 1; index < this.wizard.documents.length; index++) {
          await this.commonService.uploadDocumentToFolder(this.wizard.documents[index], response.folderName);
        }
      }
      await this.claimSubmissionWizardService.buildClaimSubmission(claimGuid);
      await this.claimSubmissionService.submit(this.wizard.claimSubmission, true, this.translation.getLanguage())
        .subscribe(p => this.showSuccess(p),
          async e => {
            if (this.validateDuplicated(e)) {
              const duplicatedClaim = this.parseMessage(e.error.message);
              await this.confirmValidationDialog(duplicatedClaim);
            } else if (this.checkIfIsBusinessException(e)) {
              if (e.error.code === 'BE_006') {
                this.showXMLMessage();
              } else if (e.error.code === 'BE_008'){
                const title = await this.getTranslateMessage('CLAIMSUBMISSION.STEP3VALIDATEXMLTITLE');
                const extraMessage = await this.getTranslateMessage('CLAIMSUBMISSION.STEP3VALIDATEXMLEXTRAMESSAGE');
                const messages = await this.createMessageList(e.error.message.split('\r\n'))
                this.notificationService.showDialog(title,
                  extraMessage + '<br><br>' + messages, false, 'CLAIMSUBMISSION.STEP3VALIDATEXMLOKBUTTON');
              }
              else{
                const title = await this.getTranslateMessage('CLAIMSUBMISSION.STEP3VALIDATEXMLTITLE');
                this.notificationService.showDialog(title,
                  e.error.message, false, 'CLAIMSUBMISSION.STEP3VALIDATEXMLOKBUTTON');
              }
            } else {
              this.showError();
            }
          },
        );
    } catch {
      this.showError();
    }
  }

  async createMessageList(messages: string[]) {
    const list = document.createElement('ul');
    messages.forEach(message =>{
      if(message != ''){
        let element = document.createElement('li');
        element.textContent = message;
        list.appendChild(element);
      }
    })
    return list.outerHTML;
  }

  private checkIfIsBusinessException(error) {
    if (error.error.code) {
      return (error.error.code.indexOf('BE_') > -1);
    }
  }

  private async confirmValidationDialog(duplicatedClaim: any) {
    this.claimSubmissionService.getClaimSubmissionByHeaderId(duplicatedClaim.ClaimHeaderId)
      .subscribe(async res => {
        if (res.data && res.data.length > 0) {
          const dialogResult = await this.confirmValidation(res.data[0]);
          switch (dialogResult) {
            case 0:
              this.updateClaimSubmission(duplicatedClaim.ClaimHeaderId);
              break;
            case 1:
              this.createClaimSubmission();
              break;
            case 2:
              this.claimSubmissionWizardService.endClaimSubmissionWizard();
              // this.router.navigate(['claims/claim-submission']);
              const nextRoute = this.router.url.replace('step3', '');
              this.router.navigate([`${nextRoute}`]);
              break;
            case 3:
              location.href = this.configurationService.returnUrl;
              break;
          }
        }
      });
  }

  /**
   *  parse message string to JSON
   * @param message Message string
   */
  parseMessage(message: string) {
    const start = message.indexOf('{');
    return JSON.parse(message.substring(start));
  }

  /**
   * show message dialog to duplicate claim.
   * @param duplicatedClaim object for duplicate claim
   */
  async confirmValidation(duplicatedClaim: ClaimSubmissionModel) {

    const translateMessages = [
      'CLAIMSUBMISSION.STEP3DUPLICATECLAIMTITLE',
      'CLAIMSUBMISSION.STEP3DUPLICATECLAIMMESSAGE',
      'CLAIMSUBMISSION.STEP3DUPLICATECLAIMCOMPLEMENT',
      'CLAIMSUBMISSION.STEP3DUPLICATECLAIMHEADERLABEL',
      'CLAIMSUBMISSION.STEP3DUPLICATEREGISTRATIONLABEL',
      'CLAIMSUBMISSION.STEP3DUPLICATEUSERLABEL',
      'CLAIMSUBMISSION.STEP3DUPLICATEPOLICYLABEL',
      'CLAIMSUBMISSION.STEP3DUPLICATEMEMBERLABEL',
      'CLAIMSUBMISSION.STEP3DUPLICATESTARTDATELABEL',
      'CLAIMSUBMISSION.STEP3DUPLICATEFILESDESCRIPTIONLABEL',
      'CLAIMSUBMISSION.STEP3DUPLICATEFILESDESCRIPTIONCOMPL'];

    const title = await this.getTranslateMessage(translateMessages[0]);
    const body = await this.getTranslateMessage(translateMessages[1]);
    const complement = await this.getTranslateMessage(translateMessages[2]);
    const claimHeader = await this.getTranslateMessage(translateMessages[3]);
    const registration = await this.getTranslateMessage(translateMessages[4]);
    const userDuplicate = await this.getTranslateMessage(translateMessages[5]);
    const idPolicyText = await this.getTranslateMessage(translateMessages[6]);
    const memberText = await this.getTranslateMessage(translateMessages[7]);
    const startDateText = await this.getTranslateMessage(translateMessages[8]);
    const filesDescriptionText = await this.getTranslateMessage(translateMessages[9]);
    const filesDescriptionCompl = await this.getTranslateMessage(translateMessages[10]);

    const receivedDateTranslate = this.dateTranslate.transform(duplicatedClaim.receivedDate);
    const startDateTranslate = this.dateTranslate.transform(duplicatedClaim.serviceFromDate);

    return this.notificationService.showDialog(title,
      `${body} <br>
       <b>${claimHeader}</b>  ${duplicatedClaim.claimHeaderId} <br>
       <b>${registration}</b> ${receivedDateTranslate} <br>
       <b>${userDuplicate}</b> ${duplicatedClaim.sender.senderFullName} <br>
       <b>${idPolicyText}</b> ${duplicatedClaim.policy.policyId} <br>
       <b>${memberText}</b> ${duplicatedClaim.member.firstName} ${duplicatedClaim.member.lastName} <br>
       <b>${startDateText}</b> ${startDateTranslate} <br><br>
       ${filesDescriptionText} <b>${duplicatedClaim.claimHeaderId}</b> ${filesDescriptionCompl}<br>
       <div class="ig-modal-scroll"><ul>
       ${duplicatedClaim.documentsSubmit.documents.map(p => `<li>${p.documentName}</li>`).join('')}
       </ul></div>
      <br> ${complement}`,
      true, 'CLAIMSUBMISSION.STEP3DUPLICATEUPDATEBUTTON',
      'CLAIMSUBMISSION.STEP3DUPLICATENEWBUTTON',
      true, 'CLAIMSUBMISSION.STEP3DUPLICATECANCELBUTTON',
      true, 'CLAIMSUBMISSION.STEP3DUPLICATEHOMEBUTTON');
  }
  /**
   * show message dialog to Xml.
   */
  async showXMLMessage() {
    const translateMessages = [
      'CLAIMSUBMISSION.STEP3VALIDATEXMLTITLE',
      'CLAIMSUBMISSION.STEP3VALIDATEXMLMESSAGE'];

    const title = await this.getTranslateMessage(translateMessages[0]);
    const body = await this.getTranslateMessage(translateMessages[1]);

    this.notificationService.showDialog(title,
      body, false, 'CLAIMSUBMISSION.STEP3VALIDATEXMLOKBUTTON');
  }

  /**
   * Method to update claim submission.
   * @param claimHeaderId Claim Header Id duplicate.
   */
  updateClaimSubmission(claimHeaderId) {
    this.wizard.claimSubmission.claimHeaderId = claimHeaderId;
    this.claimSubmissionService.update(this.wizard.claimSubmission, this.translation.getLanguage()).subscribe(
      p => this.showSuccess(p),
      error => { this.showError(); }
    );
  }
  /**
   * Method to create a new claim submission.
   */
  createClaimSubmission() {
    this.claimSubmissionService.submit(this.wizard.claimSubmission, false, this.translation.getLanguage())
      .subscribe(
        p => this.showSuccess(p),
        e => this.showError());
  }
  /**
   * Method to validate error code.
   * @param e error code return in services claim submission
   */
  validateDuplicated(e) {
    return e.error.code === 'BE_001' ||
      e.error.code === 'BE_002' ||
      e.error.code === 'BE_003' ||
      e.error.code === 'BE_004' ||
      e.error.code === 'BE_005';
  }


  /**
   * Get translated value
   * @param key Language key
   */
  getTranslateMessage(key) {
    return this.translate.get(key).toPromise();
  }

  /**
   * Show successful message
   * @param response Response
   */
  async showSuccess(response) {

    let title = '';
    let body = '';

    const translateMessages = [
      'CLAIMSUBMISSION.STEP3SUCCESS_TITLE',
      'CLAIMSUBMISSION.STEP3SUCCESS_FASTPAY_MSG',
      'CLAIMSUBMISSION.STEP3SUCCESS_MASSIVEPAY_MSG',
      'CLAIMSUBMISSION.STEP3SUCCESSBUTTONOKTEXT',
      'CLAIMSUBMISSION.STEP3SUCCESSBUTTONCANCELTEXT'
    ];

    title = await this.getTranslateMessage(translateMessages[0]);

    if (this.wizard.currentSubStep === this.STEP2_MULTI_PROVIDER) {
      const msg = await this.getTranslateMessage(translateMessages[1]);
      body = msg.toString().replace('{0}', response.claimHeaderId);
    } else {
      const msg = await this.getTranslateMessage(translateMessages[2]);
      body = msg.toString().replace('{0}', response.claimHeaderId);
    }

    const result = await this.notificationService.showDialog(
      title, body, true, translateMessages[3], translateMessages[4]);
    if (result) {
      this.claimSubmissionWizardService.endClaimSubmissionWizard();
      const url = document.URL;
      const claimsubmissiontype = url.indexOf('quickpay') > -1 ? 'quickpay' : 'massmngt';
      this.router.navigate(['claims/claim-submission-create-v1/' + claimsubmissiontype]);
    } else {
      location.href = this.configurationService.returnUrl;
    }
  }

  /**
   * Show error message
   */
  async showError() {
    const translateMessages = [
      'CLAIMSUBMISSION.STEP3ERRORTITLE',
      'CLAIMSUBMISSION.STEP3ERRORMESSAGE'];
    const title = await this.getTranslateMessage(translateMessages[0]);
    const body = await this.getTranslateMessage(translateMessages[1]);
    const result = await this.notificationService.showDialog(title, body, true,
      'CLAIMSUBMISSION.STEP3ERRORBUTTONOKTEXT', 'CLAIMSUBMISSION.STEP3ERRORBUTTONCANCELTEXT');
    if (!result) {
      location.href = this.configurationService.returnUrl;
    }
  }

  /**
   * Handle the fileScrolls scrollTop property.
   */
  hadleFileScroll() {
    this.checkDocumentCategoryLength(this.type1, this.fileScroll);
    if (this.wizard.currentSubStep === this.STEP2_MULTI_PROVIDER) {
      this.checkDocumentCategoryLength(this.type2, this.fileScrollTwo);
      this.checkDocumentCategoryLength(this.type3, this.fileScrollTree);
      this.checkDocumentCategoryLength(this.type4, this.fileScrollFour);
    }
  }

  /**
   * Set the fileScrolls scrollTop property according to they category length.
   * @param category Category.
   * @param fileScroll FileScroll.
   */
  checkDocumentCategoryLength(category: string, fileScroll: any) {
    let count: number = null;
    count = this.claimSubmissionWizardService.getDocumentsByCategory(category).length;
    if (count > 10) {
      fileScroll.nativeElement.scrollTop = ((count - 6) * 22);
    }
  }

  /**
   * Handle the documents sections visualization.
   * @param category Category.
   */
  handleShowDocument(category: string) {
    const docs = this.claimSubmissionWizardService.getDocumentsByCategory(category);
    if (docs && docs.length > 0) {
      return true;
    }
  }

  /**
   * Handle show policy number field according to user role.
   */
  handleShowPolicy() {
    if (this.user.role_id === String(this.rol.POLICY_HOLDER) ||
      this.user.role_id === String(this.rol.GROUP_POLICY_HOLDER)) {
      return false;
    } else {
        return true;
    }
  }

}
