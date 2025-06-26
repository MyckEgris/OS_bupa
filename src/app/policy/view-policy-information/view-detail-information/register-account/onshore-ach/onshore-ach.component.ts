import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Country } from 'src/app/shared/services/common/entities/country';
import { CustomerBank } from 'src/app/shared/services/common/entities/customerBank';
import { FinanceDependencyDto } from 'src/app/shared/services/common/entities/finance-dependency.dto';
import { State } from 'src/app/shared/services/common/entities/state';
import { PayeeDto } from 'src/app/shared/services/finance/entities/payee.dto';
import { FinanceService } from 'src/app/shared/services/finance/finance.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { RegisterAccountService } from '../register-service/register-account.service';
import { DialogComponent } from 'src/app/shared/upload/dialog/dialog.component';
import { MatDialog } from '@angular/material';
import { UploadService } from 'src/app/shared/upload/upload.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { UploadFilePaymentComponent } from 'src/app/shared/upload-file-payment/upload-file-payment.component';
import { ClaimSubmissionFileDocument } from 'src/app/claim/claim-submission/claim-submission-wizard/entities/ClaimSubmissionFileDocument';
import { ClaimSubmissionDocumentTypeName } from 'src/app/shared/classes/claimSubmissionDocumentType.enum';
import { HttpResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-onshore-ach',
  templateUrl: './onshore-ach.component.html'
})
export class OnshoreAchComponent implements OnInit {

  @Input() returnUrl: string;
  @Input() selectedCountry: Country;

  /**
  * Documents attachment array
  */
  public type3 = ClaimSubmissionDocumentTypeName.BANK_INFORMATION;

  public documents: Array<any>;

  public form: FormGroup;

  public banks: Array<CustomerBank>;

  public states: Array<State>;

  public payeeInformation: PayeeDto;

  public policyInformation: PolicyDto;

  public financeDependencies: FinanceDependencyDto;

  public documentTypes: Array<any>;

  public accountTypes: Array<any>;

  public currencies: Array<any>;

  public members: Array<any>;

  public certified: boolean;

  public isBoliviaBusiness: boolean;

  public documentTypeMaxLength = 0;

  private DATA_NOT_FOUND = 404;

  public showValidations = false;

  private BOLIVIA_1 = 47;

  private BOLIVIA_2 = 54;

  @Input() typeAttachment: string;
  @Input() fileTypes: string;
  @Input() maxFileSize: number;
  @Input() textButton?: string;

  constructor(
    private router: Router,
    private common: CommonService,
    private registerAccountService: RegisterAccountService,
    private finance: FinanceService,
    private notification: NotificationService,

    public dialog: MatDialog,
    public uploadService: UploadService,
    private config: ConfigurationService,

    private translate: TranslateService,
  ) {

  }

  public openUploadDialogFile() {
    const customTypes = this.fileTypes ? this.getCustomTypes() : null;
    const dialogRef = this.dialog.open(UploadFilePaymentComponent,
      { width: '70%', height: '80%', data: { customTypes: customTypes, maxFileSize: this.maxFileSize } });
    dialogRef.componentInstance.typeAttachment = this.typeAttachment;
  }

  private getCustomTypes() {
    switch (this.fileTypes) {
      case 'inquiryTypes':
        return this.config.inquiryFileTypes;
      case 'preAuthFileTypes':
        return this.config.preAuthFileTypes;
      case 'changePolicyFileTypes':
        return this.config.changePolicyFileTypes;
      case 'policyAplicationFileTypes':
        return this.config.policyAplicationFileTypes;
      case 'claimSubmissionFileTypesNoXml':
        return this.config.claimSubmissionFileTypesNoXml;
      case 'interactionsFileTypes':
        return this.config.interactionsFileTypes;
      default:
        return this.config.claimSubmissionFileTypes;
    }
  }

  ngOnInit() {
    this.payeeInformation = this.registerAccountService.getPayeeInformation();
    this.policyInformation = this.registerAccountService.getPolicyInformation();
    this.members = this.registerAccountService.getMembersInformation();
    this.getPreconfigurations();
    this.form = this.buildOnShoreAchForm();
    this.form.get('certified').valueChanges.subscribe(cert => {
      this.certified = cert;
    });
    this.form.get('ownerDocumentType').valueChanges.subscribe(type => {
      this.setValidatorsForDocumentType(type.identificationTypeId);
    });
    this.handlerBoliviaBusiness();

    this.documents = [];
    this.documents = this.uploadService.getDocuments();
  }

  removeDocument(document: ClaimSubmissionFileDocument, e) {
    this.uploadService.remove(document);
    this.documents = this.uploadService.getDocuments();
    e.preventDefault();
  }

  buildOnShoreAchForm() {
    return new FormGroup({
      owner: new FormControl('', Validators.required),
      ownerDocumentType: new FormControl(''),
      ownerDocumentNumber: new FormControl(''),
      accountType: new FormControl(''),
      accountNumber: new FormControl(''),
      bank: new FormControl('', Validators.required),
      clabe: new FormControl('', [Validators.required, Validators.minLength(18), Validators.maxLength(18)]),
      currency: new FormControl(''),
      certified: new FormControl(false, Validators.required),
      filePayment: new FormControl(false, Validators.required)
    });
  }

  setValidatorsForDocumentType(type) {
    switch (type) {
      case 4: // National document
        this.form.get('ownerDocumentType').setValidators(Validators.maxLength(20));
        this.documentTypeMaxLength = 20;
        break;
      case 2: // Passport
        this.form.get('ownerDocumentType').setValidators(Validators.maxLength(10));
        this.documentTypeMaxLength = 10;
        break;
      case 108: // RUC
        this.form.get('ownerDocumentType').setValidators(Validators.maxLength(13));
        this.documentTypeMaxLength = 13;
        break;
      default:
        this.form.get('ownerDocumentType').setValidators(Validators.maxLength(10));
        this.documentTypeMaxLength = 10;
        break;
    }

    this.form.get('ownerDocumentNumber').setValue('');
    this.form.updateValueAndValidity();
  }

  getPreconfigurations() {
    this.getBanksByCountryId(this.policyInformation.policyCountryId);
    this.getStatesByCountryId(this.policyInformation.policyCountryId);
    this.getFinanceDependencies();
  }

  getFinanceDependencies() {
    this.common.getFinanceDependenciesByinsurance(this.policyInformation.insuranceBusinessId).subscribe(dep => {


      this.currencies = dep.currencies;
      this.documentTypes = dep.identificationTypes;

      this.accountTypes = dep.bankAccountTypes;
      this.documentTypes.forEach(el => {
        el.typeName = el.typeName.trim();
      });
      this.setDefaultCurrency();
    });
  }

  setDefaultCurrency() {
    if (this.currencies && this.currencies.length > 0) {
      if (this.currencies.length === 1) {
        this.form.get('currency').setValue(this.currencies[0]);
      }
    }
  }

  getBanksByCountryId(countryId: number) {
    this.common.getCustomerBanksByCountryId(countryId).subscribe(banks => {
      this.banks = banks;
    });
  }

  getStatesByCountryId(countryId: number) {
    this.common.getStatesByCountry(countryId).subscribe(states => {
      this.states = states;
    });
  }

  back() {
    this.router.navigate([this.returnUrl]);
  }

  /**
 * Get translated value
 * @param key Language key
 */
  getTranslateMessage(key) {
    return this.translate.get(key).toPromise();
  }

  async registerAccount() {
    if (this.form.valid) {
      if (this.documents[0] != null) {
        const file: File = this.documents[0].file;
        const newPayee: PayeeDto = {
          payeeId: 0,
          accountName: this.form.get('owner').value.fullName,
          AccountLastName: this.form.get('owner').value.lastName,
          AccountFirstName: this.form.get('owner').value.firstName,
          accountNumber: null,
          accountCode: null,
          accountCountryId: this.selectedCountry.countryId,
          policyId: this.policyInformation.policyId,
          memberId: this.form.get('owner').value.memberId,
          bankAccountTypeId: this.form.get('accountType').value.bankAccountTypeId,
          bankAccountType: this.form.get('accountType').value.bankAccountTypeDesc,
          paymentMethodId: 17,
          claimPreferred: false,
          beneficiaryBankId: this.form.get('bank').value.customerBankId,
          beneficiaryBank: this.form.get('bank').value.bankName,
          currencyId: this.form.get('currency').value.currencyId,
          insuranceBusinessId: this.policyInformation.insuranceBusinessId,
          isCreatedForClaims: true,
          bankName: this.form.get('bank').value.bankName,
          contactIdentificationTypeId: this.form.get('ownerDocumentType').value.identificationTypeId,
          contactIdentificationType: this.form.get('ownerDocumentType').value.typeName,
          contactIdentificationNumber: this.form.get('ownerDocumentNumber').value,
          clabe: this.form.get('clabe').value,
          receivedModeId: 2890,
          bank: this.form.get('bank').value.bankName,
          type: 'ONSHOREACH'
        };
        this.finance.savePayeeWithFile(newPayee, file).subscribe((result: HttpResponse<any>) => {
          if (result.status === 200) {

            this.registerAccountService.setRegisterSummary(newPayee);
            this.uploadService.removeAllDocuments();
            this.router.navigate([`/policies/register-account-success/${this.policyInformation.policyId}`]);
          }
        }, async error => {
          if (error.error.code === 'BE_001') {
            const title = await this.getTranslateMessage('PAYMENTS.ERRORS.ERROR');
            const ok = await this.translate.get('POLICY.VIEW_POLICY_DETAILS.TABS.CLAIMS_PAYMENT_METHOD.ACTIONS.DEACTIVATE.OK').toPromise();
            const msj = await this.translate.get('POLICY.VIEW_POLICY_DETAILS.TABS.CLAIMS_PAYMENT_METHOD.ACTIONS.REGISTER.ACCOUNT').toPromise();
            this.notification.showDialog(title, msj, false, ok);
          } else {
            const title = await this.getTranslateMessage('PAYMENTS.ERRORS.ERROR');
            const ok = await this.translate.get('POLICY.VIEW_POLICY_DETAILS.TABS.CLAIMS_PAYMENT_METHOD.ACTIONS.DEACTIVATE.OK').toPromise();
            const msj = await this.translate.get('POLICY.VIEW_POLICY_DETAILS.TABS.CLAIMS_PAYMENT_METHOD.ACTIONS.REGISTER.ACCOUNT_ERROR').toPromise();
            this.notification.showDialog(title, msj, false, ok);
          }
        }
        );
      }
      else {
        const title = await this.getTranslateMessage('POLICY.APPLICATION.STEP2.HEALTH_MANDATORY_TITLE');
        const ok = await this.translate.get('POLICY.VIEW_POLICY_DETAILS.TABS.CLAIMS_PAYMENT_METHOD.ACTIONS.DEACTIVATE.OK').toPromise();
        const msg = await this.translate.get('POLICY.APPLICATION.STEP2.SECTION_MANDATORY_MESSAGE').toPromise();
        this.notification.showDialog(title, msg.toString().replace('{0}', ""), false, ok);
      }
    }
    else {
      this.showValidations = true;
    }
  }

  onFileChange(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.form.patchValue({
        filePayment: file
      });
    }
  }

  checkIfBussinessError(error) {
    return (error.status === this.DATA_NOT_FOUND);
  }

  handlerBoliviaBusiness() {
    if (this.policyInformation.insuranceBusinessIsOnShore === true) {
      if (this.policyInformation.insuranceBusinessId === this.BOLIVIA_1 || this.policyInformation.insuranceBusinessId === this.BOLIVIA_2) {
        return this.isBoliviaBusiness = true;
      }
    }
  }

}
