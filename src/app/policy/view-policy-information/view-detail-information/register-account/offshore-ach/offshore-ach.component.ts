import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Country } from 'src/app/shared/services/common/entities/country';
import { PayeeDto } from 'src/app/shared/services/finance/entities/payee.dto';
import { FinanceService } from 'src/app/shared/services/finance/finance.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { RegisterAccountService } from '../register-service/register-account.service';

@Component({
  selector: 'app-offshore-ach',
  templateUrl: './offshore-ach.component.html'
})
export class OffshoreAchComponent implements OnInit {

  @Input() returnUrl: string;
  @Input() selectedCountry: Country;

  public form: FormGroup;

  public payeeInformation: PayeeDto;

  public policyInformation: PolicyDto;

  public members: Array<any>;

  public accountTypes: Array<any>;

  public certified: boolean;

  public helpAccount: string;

  constructor(
    private router: Router,
    private common: CommonService,
    private registerAccountService: RegisterAccountService,
    private finance: FinanceService,
    private notification: NotificationService,
    private translate: TranslateService,
    private translation: TranslationService
  ) { }

  ngOnInit() {
    this.payeeInformation = this.registerAccountService.getPayeeInformation();
    this.policyInformation = this.registerAccountService.getPolicyInformation();
    this.helpAccount = this.getHelpAccountImage();
    this.members = this.registerAccountService.getMembersInformation();
    this.getFinanceDependencies();
    this.form = this.buildOffShoreAchForm();
    this.form.valueChanges.subscribe(ch => {
      this.certified = ch.certified;
    });
    this.translate.onLangChange.subscribe(img => {
      this.helpAccount = this.getHelpAccountImage();
    });
  }

  getHelpAccountImage() {
    switch (this.translation.getLanguage()) {
      case 'SPA':
        return './assets/images/codigo.jpg';
      case 'ENG':
        return './assets/images/abacode.jpg';
    }
  }

  buildOffShoreAchForm() {
    return new FormGroup({
      owner: new FormControl('', [Validators.required]),
      accountType: new FormControl('', [Validators.required]),
      accountNumber: new FormControl('', [Validators.required, Validators.maxLength(35)]),
      // tslint:disable-next-line: max-line-length
      abaNumber: new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
      certified: new FormControl(false, Validators.required)
    });
  }

  getFinanceDependencies() {
    this.common.getFinanceDependenciesByinsurance(this.policyInformation.insuranceBusinessId).subscribe(dep => {
      this.accountTypes = dep.bankAccountTypes;
    });
  }

  back() {
    this.router.navigate([this.returnUrl]);
  }

  registerAccount() {
    if (this.form.valid) {
      const newPayee: PayeeDto = {
        payeeId: 0,
        accountName: this.form.get('owner').value.fullName,
        AccountLastName: this.form.get('owner').value.lastName,
        AccountFirstName: this.form.get('owner').value.firstName,
        accountNumber: this.form.get('accountNumber').value,
        accountCode: this.form.get('abaNumber').value,
        accountCountryId: this.selectedCountry.countryId,
        policyId: this.policyInformation.policyId,
        memberId: this.form.get('owner').value.memberId,
        bankAccountTypeId: this.form.get('accountType').value.bankAccountTypeId,
        bankAccountType: this.form.get('accountType').value.bankAccountTypeDesc,
        paymentMethodId: 17,
        claimPreferred: false,
        beneficiaryBankId: null,
        currencyId: 192,
        insuranceBusinessId: this.policyInformation.insuranceBusinessId,
        isCreatedForClaims: true,
        bankName: null,
        contactIdentificationTypeId: null,
        contactIdentificationNumber: null,
        receivedModeId: 2890,
        type: 'OFFSHOREACH'
      };

      this.finance.savePayee(newPayee).subscribe(result => {
        this.registerAccountService.setRegisterSummary(newPayee);
        this.router.navigate([`/policies/register-account-success/${this.policyInformation.policyId}`]);
      }, error => {
        this.notification.showDialog('Error', 'Error al registrar la cuenta', false, 'OK');
      });
    }
  }

}
