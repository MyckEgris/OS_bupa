import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { Country } from 'src/app/shared/services/common/entities/country';
import { PayeeDto } from 'src/app/shared/services/finance/entities/payee.dto';
import { FinanceService } from 'src/app/shared/services/finance/finance.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { RegisterAccountService } from '../register-service/register-account.service';

@Component({
  selector: 'app-offshore-wt',
  templateUrl: './offshore-wt.component.html'
})
export class OffshoreWtComponent implements OnInit {

  @Input() returnUrl: string;
  @Input() selectedCountry: Country;

  public form: FormGroup;

  public payeeInformation: PayeeDto;

  public policyInformation: PolicyDto;

  public accountTypes: Array<any>;

  public countries: Array<Country>;

  public defaultCountry = {};

  public members: Array<any>;

  public certified: boolean;

  constructor(
    private router: Router,
    private common: CommonService,
    private registerAccountService: RegisterAccountService,
    private finance: FinanceService,
    private notification: NotificationService
  ) { }

  ngOnInit() {
    this.payeeInformation = this.registerAccountService.getPayeeInformation();
    this.policyInformation = this.registerAccountService.getPolicyInformation();
    this.members = this.registerAccountService.getMembersInformation();
    this.getFinanceDependencies();
    this.form = this.buildOffShoreWtForm();
    this.form.valueChanges.subscribe(ch => {
      this.certified = ch.certified;
    });
  }

  buildOffShoreWtForm() {
    return new FormGroup({
      owner: new FormControl('', Validators.required),
      accountType: new FormControl('', Validators.required),
      accountNumber: new FormControl('', [Validators.required, Validators.maxLength(35)]),
      swiftNumber: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(11),
      Validators.pattern('[a-zA-Z]{1,6}[0-9a-zA-Z]{2}([0-9]?){3}$')]),
      bankName: new FormControl('', [Validators.required, Validators.maxLength(150)]),
      bankAddress: new FormControl('', [Validators.required, Validators.maxLength(500)]),
      certified: new FormControl(false, Validators.required)
    });
  }

  getFinanceDependencies() {
    this.common.getFinanceDependenciesByinsurance(this.policyInformation.insuranceBusinessId).subscribe(dep => {
      this.accountTypes = dep.bankAccountTypes;
    });
  }

  getDefaultCountry(countries) {
    this.defaultCountry = countries.find(x => x.countryId === this.policyInformation.policyCountryId);
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
        accountCode: this.form.get('swiftNumber').value,
        accountCountryId: this.selectedCountry.countryId,
        policyId: this.policyInformation.policyId,
        memberId: this.form.get('owner').value.memberId,
        bankAccountTypeId: this.form.get('accountType').value.bankAccountTypeId,
        bankAccountType: this.form.get('accountType').value.bankAccountTypeDesc,
        beneficiaryBank: this.form.get('bankName').value,
        paymentMethodId: 6,
        claimPreferred: false,
        beneficiaryBankId: null,
        currencyId: 192,
        insuranceBusinessId: this.policyInformation.insuranceBusinessId,
        isCreatedForClaims: true,
        bankName: this.form.get('bankName').value,
        bankAddress: this.form.get('bankAddress').value,
        contactIdentificationTypeId: null,
        contactIdentificationNumber: null,
        clabe: null,
        receivedModeId: 2890,
        type: 'OFFSHOREWT'
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
