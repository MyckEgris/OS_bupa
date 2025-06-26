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
import { ClaimFormWizard } from '../claim-form-wizard/entities/ClaimFormWizard';
import { ClaimResponse } from '../claim-form-wizard/entities/claimResponse';
import { ClaimFormWizardService } from '../claim-form-wizard/claim-form-wizard.service';
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
import { MedicalQuestions } from 'src/app/shared/services/medical-questionaries/entities/medical-questions.model';
import { ClaimFormQuestionary } from 'src/app/shared/services/claim-submission/entities/ClaimFormQuestionary';
import { Country } from 'src/app/shared/services/agent/entities/country';
import { HttpErrorResponse } from '@angular/common/http';
import { PolicyNatureId } from 'src/app/shared/classes/policy-nature.enum';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { MemberOutputDto } from 'src/app/shared/services/policy/entities/member';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { FormGroup } from '@angular/forms';
import * as moment from 'moment';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { Currency } from 'src/app/shared/services/common/entities/currency';
// import { DecimalPipe } from '@angular/common';



/**
 *  This class shows step 3 of claim submission wizard.
 */
@Component({
  selector: 'app-claim-form-step5',
  templateUrl: './claim-form-step5.component.html'
})
export class ClaimFormStep5Component implements OnInit, OnDestroy, OnChanges {

  /**
  * Constant to identify the CLaimFormWizard current step
  */
  public currentStep = 6;

  /**
   * Step 5
   */
  public STEP5 = 'step6';

  /**
   * Step 6
   */
  public STEP6 = 'step7';

  /**
   * User Authenticated Object
   */
  public user: UserInformationModel;

  /**
   * ClaimSubmissionWizard Object
   */
  public wizard: ClaimFormWizard;

  /**
  * Wizard Subscription.
  */
  public subWizard: Subscription;

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
   * Constant to identify DocType type2
   */
  public type2 = ClaimSubmissionDocumentTypeName.CLAIM_BILL;

  /**
   * Constant to identify DocType type3
   */
  public type3 = ClaimSubmissionDocumentTypeName.CLAIM_DUCUMENTS;

  /**
   * Const to Identify the single_provider sub step component
   */
  public STEP2_SINGLE_PROVIDER = 'single_provider';

  /**
   * Const to Identify the multi_provider sub step component
   */
  public STEP2_MULTI_PROVIDER = 'multi_provider';

  /**
  * Constant to identify the answer yesd or not
  */
  public ANSWER_YES = 'CLAIMFORM.CUESTIONARY.ANSWER.YES';


  /**
  * Constant to identify the answer yesd or not
  */
  public ANSWER_NOT = 'CLAIMFORM.CUESTIONARY.ANSWER.NOT';
  /**
   * User Rol enum
   */
  public rol = Rol;

  public claimFormQuestionary = [];

  public countryName = '';


  /**
   * Policy's country instance.
   */
  public countries: Country[] = [];
  public currencies: Currency[] = [];

  public bankAccountType = 0;

  claimsResponse: ClaimResponse[] = [];

  public policyContact: Partial<PolicyDto> = null;

  private memberInSession: MemberOutputDto = null;

  listClaims: ClaimSubmissionModel[] = [];

  finalListClaims: ClaimSubmissionModel[] = [];
  public fileNameSend: Array<any>;
  /**
   * Constructor Method
   * @param claimFormWizardService Claim Submission Wizard Service Injection
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
    private claimFormWizardService: ClaimFormWizardService,
    private claimSubmissionService: ClaimSubmissionService,
    private router: Router,
    private notificationService: NotificationService,
    private commonService: CommonService,
    private providerService: ProviderService,
    private translate: TranslateService,
    private translation: TranslationService,
    private _ref: ChangeDetectorRef,
    private configurationService: ConfigurationService,
    private authService: AuthService,
    private policyService: PolicyService,
    private uploadService: UploadService,
    // private decimalPipe: DecimalPipe

  ) {
    this.dateTranslate = new DateTranslatePipe(this.translate, this._ref);
  }

  /**
  * Ends the component operation.
  */
  ngOnDestroy() {
    if (this.subWizard) { this.subWizard.unsubscribe(); }
  }

  /**
   * Initialize subscription and generate guids
   */
  ngOnInit() {

    this.user = this.authService.getUser();
    this.subWizard = this.claimFormWizardService.beginWizard(
      wizard => {
        this.wizard = wizard;
      }, this.currentStep
    );
    // this.commonService.newGuid(g => this.wizard.claimGuid = g);
    this.commonService.newGuid(g => this.wizard.statusGuid = g);
    this.hadleFileScroll();
    this.getCuestionary();
    this.getCountry();
    this.getAccountType();
    this.getCurrencies();
    this.translate.onLangChange.subscribe(lang => {
      this.getQuestions();
    });

    this.fileNameSend = []
    this.fileNameSend = this.uploadService.getAllFilesIndex();
  }


  getQuestions() {
    if (this.claimFormQuestionary) {
      const currentLang = this.translation.getLanguageId();
      this.claimFormQuestionary.forEach((element: ClaimFormQuestionary) => {
        element.medicalQuestion = element.medicalQuestionObject.medicalQuestionByLanguages
          .find(x => x.languageId === currentLang).question || '';
      });
    }
  }

  ngOnChanges() {
    this.hadleFileScroll();
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
    const nextRoute = this.router.url.replace('step6', 'step3');
    this.router.navigate([`${nextRoute}`]);
  }

  /**
   * Submit Step 3 to claim submission service with claims, documents and folders
   */
  async submit() {
    let indexIte: number = 0;
    this.listClaims = [];
    let sendFirts : boolean = false;
    this.finalListClaims = [];
    
    for (const claimFormGroup of this.claimFormWizardService.claimList.controls) {
      const claimGuid: string = await this.commonService.newGuidNuevo().toPromise();

      this.fileNameSend = []
      this.fileNameSend = this.uploadService.getAllFilesIndex();
      
      for (let i = 0; i < this.fileNameSend.length; i++) {
        const elemento = this.fileNameSend[i];
        if (indexIte == elemento.index){
          if(!sendFirts){
            const response = await this.commonService.uploadFirstDocument(this.fileNameSend[i]);
            this.wizard.folderName = response.folderName;
            sendFirts = true
          }
          else{
            const responseFolder = await this.commonService.uploadDocumentToFolder(this.fileNameSend[i], this.wizard.folderName);
            this.fileNameSend[i].file.fileName = responseFolder.fileName;
          }
        }
      }

      const treatmentStartDate = moment(claimFormGroup.get('treatmentStartDate').value).format('YYYY-MM-DD');
      const treatmentEndDate = moment(claimFormGroup.get('treatmentEndDate').value).format('YYYY-MM-DD');
      const amount = claimFormGroup.get('amount').value;
      const currencyId = claimFormGroup.get('currencyId').value;
      const countryOfServiceId = claimFormGroup.get('countryOfServiceId').value;

      const newClaim = await this.claimFormWizardService.buildClaimSubmissionList(treatmentStartDate, treatmentEndDate,  amount, currencyId, claimGuid, indexIte, countryOfServiceId);
      this.listClaims.push(newClaim);
      indexIte = indexIte + 1;
      sendFirts = false;
    }

    // OS just take the first 5 elements
    this.finalListClaims = [];
    this.finalListClaims = this.listClaims.slice(0,5)
    this.claimSubmissionService.submitList(this.finalListClaims, true, this.translation.getLanguage()).subscribe(
      p => {
        this.showSuccess(p)
      },
      async e => {
        console.error(e);
        if (this.validateDuplicated(e)) {
          const duplicatedClaim = this.parseMessage(e.error.message);
          await this.confirmValidationDialog(duplicatedClaim);
        } else if (this.checkIfIsBusinessException(e)) {
          if (e.error.code === 'BE_006') {
            this.showXMLMessage();
          } else if (e.error.code === 'BE_008') {
            const title = await this.getTranslateMessage('CLAIMSUBMISSION.STEP3VALIDATEXMLTITLE');
            const extraMessage = await this.getTranslateMessage('CLAIMSUBMISSION.STEP3VALIDATEXMLEXTRAMESSAGE');
            const messages = await this.createMessageList(e.error.message.split('\r\n'))
            this.notificationService.showDialog(title,
              extraMessage + '<br><br>' + messages, false, 'CLAIMSUBMISSION.STEP3VALIDATEXMLOKBUTTON');
          }
          else {
            const title = await this.getTranslateMessage('CLAIMSUBMISSION.STEP3VALIDATEXMLTITLE');
            this.notificationService.showDialog(title,
              e.error.message, false, 'CLAIMSUBMISSION.STEP3VALIDATEXMLOKBUTTON');
          }
        } else {
          this.showError();
        }
      },
    );

  }

  async createMessageList(messages: string[]) {
    const list = document.createElement('ul');
    messages.forEach(message => {
      if (message != '') {
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
              this.router.navigate(['claims/claim-submission']);
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
    this.claimsResponse = response;
    this.claimFormWizardService.dataResponse = response.data;
    this.claimFormWizardService.claimBatchId = response.claimBatchId;
    this.wizard.claimHeader = response.claimHeaderId;
    this.wizard.claimDate = response.resolutionDate;
    this.wizard.payDate = response.paymentDate;
    this.router.navigate(['claims/claim-submission-create-v2/quickpay/step7']);
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
    this.checkDocumentCategoryLength(this.type2, this.fileScrollTwo);
    this.checkDocumentCategoryLength(this.type3, this.fileScrollTree);
  }

  /**
   * Set the fileScrolls scrollTop property according to they category length.
   * @param category Category.
   * @param fileScroll FileScroll.
   */
  checkDocumentCategoryLength(category: string, fileScroll: any) {
    let count: number = null;
    count = this.claimFormWizardService.getDocumentsByCategory(category).length;
    if (count > 10) {
      fileScroll.nativeElement.scrollTop = ((count - 6) * 22);
    }
  }

  /**
   * Handle the documents sections visualization.
   * @param category Category.
   */
  handleShowDocument(category: string) {
    const docs = this.claimFormWizardService.getDocumentsByCategory(category);
    if (docs && docs.length > 0) {
      return true;
    } else { return false; }
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

  getCuestionary() {
    if (this.wizard && this.wizard.claimFormQuestionary) {
      this.claimFormQuestionary = this.wizard.claimFormQuestionary.filter(x => x.answer !== '');
    } else {
      this.claimFormQuestionary = [];
    }
  }

  getCountry() {
    this.commonService.getCountries().subscribe(
      result => {
        this.countries = result;
        this.countryName = this.countries.find(x => x.countryId === this.wizard.countryOfServiceId).countryName;
      },
      error => {
        if (error.error.code) {
          this.showErrorMessage(error);
        }
      }
    );
  }

  getCurrencies() {
    this.commonService.getCurrencies().subscribe(
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

  getCountryName(countryId: any): string {
    // Aquí va la lógica para obtener el nombre del país
    return this.countries.find(x => x.countryId === parseInt(countryId)).countryName;
  }

  getCurrency(currencyId: any, amount: any) {

    return this.currencies.find(x => x.currencyId === parseInt(currencyId)).currencyCode;
  }

  getAccountType() {
    switch (this.wizard.searchForm.value.bankAccountName.toUpperCase()) {
      case 'SAVING': {
        this.bankAccountType = 1;
        break;
      }
      case 'CHECKING':
        this.bankAccountType = 2;
        break;
      default:
        this.bankAccountType = 1;
        break;
    }
  }

  private showErrorMessage(errorMessage: HttpErrorResponse) {
    let message = '';
    let messageTitle = '';
    this.translate.get(`AGENT.PROFILE.ERROR_CODE.${errorMessage.error.code}`).subscribe(
      result => message = result
    );
    this.translate.get(`AGENT.PROFILE.ERROR_MESSAGE.${errorMessage.error.code}`).subscribe(
      result => messageTitle = result
    );
    this.notificationService.showDialog(messageTitle, message);
  }

  cancel() {
    this.router.navigate(['']);
  }

  /**
   * Role is PolicyMember
   */
  public get handleIsPolicyMember(): boolean {
    return (this.user.role_id === String(Rol.POLICY_MEMBER));
  }

  /**
 * Is BTI Policy
 */
  public get handleIsBTIPolicy(): boolean {
    const policyNatureId = this.wizard.policyHolder.policyNatureId;
    const policyNatureIds: number[] = [PolicyNatureId.TRAVELBTI];
    return (policyNatureIds.includes(policyNatureId));
  }


}
