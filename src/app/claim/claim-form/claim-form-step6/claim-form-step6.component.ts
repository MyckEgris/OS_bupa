import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { ClaimFormWizard } from '../claim-form-wizard/entities/ClaimFormWizard';
import { ClaimFormWizardService } from '../claim-form-wizard/claim-form-wizard.service';
import { Subscription } from 'rxjs';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { ActivatedRoute } from '@angular/router';
import { ClaimResponse } from '../claim-form-wizard/entities/claimResponse';

interface Message {
  title: string;
  body: string;
}

// import { ClaimFormStep5Component } from '../claim-form-step5/claim-form-step5.component'
/**
 * This class shows step 1 Agent of claim submission wizard.
 */
@Component({
  selector: 'app-claim-form-step6-agent',
  templateUrl: './claim-form-step6.component.html'
})
export class ClaimFormStep6Component implements OnInit, OnDestroy {
  claimForm: ClaimFormWizard;
  user: UserInformationModel;

  title: string[] = [];
  extraMessage: string[] = [];
  messages: string[] = [];

  public wizard: ClaimFormWizard;
  /**
  * Wizard Subscription.
  */
  public subWizard: Subscription;
  public currentStep = 6;
  public ECUADOR_BUSINESS_ID = 39;
  public BOLIVIA_BUSINESS_ID_1 = 47;
  public BOLIVIA_BUSINESS_ID_2 = 54;
  public DR_BUSINESS_ID = 40;
  public PANAMA_BUSINESS_ID = 56;
  public GUATEMALA_BUSINESS_ID = 55;
  currentDate = new Date();
  public claimDate = '';
  public payDate = '';
  public bankAccountType = 0;
  public bankAccountValid;
  public bankAccountClabeValid;
  constructor(private authService: AuthService,
    public claimFormWizardService: ClaimFormWizardService,
    private configurationService: ConfigurationService,
    private translate: TranslateService,
    private uploadService: UploadService,
    private route: ActivatedRoute
  ) { }

  /**
  * Ends the component operation.
  */
  ngOnDestroy() {
    if (this.subWizard) { this.subWizard.unsubscribe(); }
    this.uploadService.removeAllDocuments();
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.subWizard = this.claimFormWizardService.beginWizard(
      wizard => { this.wizard = wizard; }, this.currentStep
    );
    console.log(this.wizard.searchForm)
    this.claimDate = this.wizard.claimDate;
    this.payDate = this.wizard.payDate;
    this.getClaim();
    this.getAccountType();
    this.getAccountBank();
  }

  /**
     * Get translated value
     * @param key Language key
     */
  getTranslateMessage(key) {
    return this.translate.get(key).toPromise();
  }

  async getClaim() {
    const msg = await this.translate.get('CLAIMFORM.RESUMECLAIMTITLE').toPromise();
    msg.toString().replace('{0}', this.wizard.claimHeader);
  }
  get getRouterLink(): string {
    return 'claims/claim-submission';
  }

  get claim(): string {
    const claimNumber = this.wizard.claimHeader;
    return `${claimNumber}`;
  }

  get fullNameOwner(): string {
    const owner = this.wizard.member;
    return `${owner.firstName} ${owner.lastName}`;
  }

  finish() {
    this.wizard = null;
    location.href = this.configurationService.returnUrl;
  }

  get payClaim(): string {
    const currencCode = this.wizard.searchForm.value.currencyCode;
    const amount = this.wizard.searchForm.value.amount;
    if (amount) {
      return `${amount}`;
    }
    return '';
  }

  get destinationAccount(): string {
    const bankNumber = this.wizard.searchForm.value.bankAccountNumber;
    return ` ${bankNumber}`;
  }

  get destinationClabeAccount(): string {
    const bankNumber = this.wizard.searchForm.value.bankAccountClabe;
    return ` ${bankNumber}`;
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

  getAccountBank() {
    if (this.wizard.searchForm.value.bankAccountNumber === null) {
      this.bankAccountValid = '';
      this.bankAccountClabeValid = '1';
    }
    else {
      this.bankAccountValid = '1';
      this.bankAccountClabeValid = ''
    }
  }

  ngAfterViewInit() {
    this.claimFormWizardService.dataResponse.forEach((claim, index) => {
      this.erroValidate(claim.errorCode, claim.errorMessage, index);
    });
  }

  async erroValidate(errorCode: string, errorMessage: string, index: number) {
    if (this.validateDuplicatedString(errorCode)) {
      const duplicatedClaim = this.parseMessage(errorMessage);
      // await this.confirmValidationDialogString(duplicatedClaim);
    } else if (this.checkIfIsBusinessExceptionString(errorCode)) {
      if (errorCode === 'BE_006') {
        this.showXMLMessageString().then(message => {
          this.title[index] = message.title;
          this.messages[index] = message.body;
        });
      } else if (errorCode === 'BE_008') {
        this.title[index] = await this.getTranslateMessage('CLAIMSUBMISSION.STEP3VALIDATEXMLTITLE');
        this.extraMessage[index] = await this.getTranslateMessage('CLAIMSUBMISSION.STEP3VALIDATEXMLEXTRAMESSAGE');
        this.messages[index] = await this.createMessageList(errorMessage.split('\r\n'))
      }
      else {
        this.title[index] = await this.getTranslateMessage('CLAIMSUBMISSION.STEP3VALIDATEXMLTITLE');
      }
    } else {
      const translateMessages = [
        'CLAIMSUBMISSION.STEP3ERRORTITLE',
        'CLAIMSUBMISSION.STEP3ERRORMESSAGE'];
      this.title[index] = await this.getTranslateMessage(translateMessages[0]);
      this.messages[index] = await this.getTranslateMessage(translateMessages[1]);
    }
  }

  async createMessageList(messages: string[]) {
    const list = document.createElement('ul');
    messages.forEach(message => {
      const trimmedMessage = message.trim();
      if (trimmedMessage !== '') {
        let element = document.createElement('li');
        element.innerHTML = trimmedMessage;
        list.appendChild(element);
      }
    })
    return list.outerHTML;
  }


  validateDuplicatedString(e) {
    return e === 'BE_001' ||
      e === 'BE_002' ||
      e === 'BE_003' ||
      e === 'BE_004' ||
      e === 'BE_005';
  }

  parseMessage(message: string) {
    const start = message.indexOf('{');
    return JSON.parse(message.substring(start));
  }

  public checkIfIsBusinessExceptionString(error) {
    if (error) {
      return (error.indexOf('BE_') > -1);
    }
  }

  async showXMLMessageString(): Promise<Message> {
    const translateMessages = [
      'CLAIMSUBMISSION.STEP3VALIDATEXMLTITLE',
      'CLAIMSUBMISSION.STEP3VALIDATEXMLMESSAGE'];

    const title = await this.getTranslateMessage(translateMessages[0]);
    const body = await this.getTranslateMessage(translateMessages[1]);

    return { title, body };
  }




}
