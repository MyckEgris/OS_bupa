import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { Router } from '@angular/router';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';

@Component({
  selector: 'app-payment-credit-card',
  templateUrl: './payment-credit-card.component.html',
  providers: []
})
export class PaymentCreditCardComponent implements OnInit {

  @ViewChild('customValue') private customValue;

  @Input() policy: PolicyDto;
  public bupaInsurance: number;
  currentStep: number;
  modelPayment: any;
  isPartialPayment = false;
  isMexico = false;
  txtCustomPayMex: any;
  txtCustomPay: any;
  gatewayPayActive = false;
  customPay = false;
  policyAmount: string;
  currencySymbol: string;
  validateMessageInCustomPay: string;
  newValueToPay: number;
  paymentInDollarsFromMexico = false;
  valueInMexicanPesosFromUsd: number;
  isExchangeRateValid = true;

  amountaux: any;
  valQuantity: string;

  public startInactivityMxPortal: Date;
  public endInactivityMxPortal: Date;
  public today: Date;


  constructor(private authService: AuthService,
    private paymentService: PaymentService,
    private config: ConfigurationService,
    private translate: TranslateService,
    private router: Router) {
    this.modelPayment = {
      paymentOption: 'TotalPay',
      wrongPaymentValue: false,
      disabledCustomValue: true
    };
  }

  ngOnInit() {
    this.setAmountTotalToPay();
    this.currentStep = 1;
    this.bupaInsurance = +this.policy.insuranceBusinessId;
    this.setCustomPay();
    this.isPaymentInDollarsFromMexico();
  }

  setAmountTotalToPay() {
    this.policy.amountTotalToPay = this.policy.amountToPay;
    this.policy.amountUSDTotalToPay = this.policy.amountUSDToPay;
    this.paymentService.setPolicyToPay(this.policy);
  }

  setCustomPay() {
    this.gatewayPayActive = !this.getCustomPayByBupaInsurance();
    this.customPay = this.getCustomPayByBupaInsurance();
    this.policyAmount = this.policy.amountToPay.toString();
    this.isMexico = this.bupaInsurance === 41 ? true : false;
    this.setInitialAmount(this.policy.amountToPay);
    this.currencySymbol = this.paymentService.getCurrencyCode(this.policy);
    this.customValue = this.policy.amountToPay.toLocaleString();
    this.translate.get('PAYMENTS.OK_RESULT.VALIDATE_QUANTITY').subscribe(val => {
      this.valQuantity = val;
    });
  }

  getCustomPayByBupaInsurance() {
    return this.bupaInsurance === 39 || this.bupaInsurance === 41 ? true : false;
  }

  setInitialAmount(amount) {
    this.amountaux = amount;
  }

  getInitialamount() {
    return this.amountaux;
  }

  customPayValidation(event) {

    if (this.isPartialPayment) {

      const newAmountToPay = event.target.value != null ? event.target.value : null;

      if (newAmountToPay != null && newAmountToPay > 0 && newAmountToPay <= this.policy.amountToPay) {

        this.policy.amountToPay = newAmountToPay;
        this.policy.amountUSDToPay = newAmountToPay;
        this.validateMessageInCustomPay = null;
        this.modelPayment.wrongPaymentValue = false;
      } else {
        this.validateMessageInCustomPay = this.valQuantity;
        this.modelPayment.wrongPaymentValue = true;
      }
    } else {
      this.policy.amountToPay = this.getInitialamount();
    }

  }

  getNewPolicyValueInUSD(amount: number) {
    return amount * this.policy.exchangeRate;
  }

  changePaymentOption(e) {
    if (e.target.value === 'PartialPay') {
      this.isPartialPayment = true;
      this.modelPayment.disabledCustomValue = false;
      this.modelPayment.wrongPaymentValue = true;
    } else {
      this.isPartialPayment = false;
      this.modelPayment.wrongPaymentValue = false;
      this.validateMessageInCustomPay = null;
      this.modelPayment.disabledCustomValue = true;
      this.customValue.nativeElement.value = '';
      this.policy.amountToPay = this.getInitialamount();
      this.policy.amountUSDToPay = this.getNewPolicyValueInUSD(this.getInitialamount());
    }
  }

  onClickPaymentPolicy() {
    if (this.isPartialPayment) {
      if (this.newValueToPay <= 0) {
        this.validateMessageInCustomPay = this.valQuantity;
        this.modelPayment.wrongPaymentValue = true;
      } else {
        this.modelPayment.wrongPaymentValue = false;
      }
    }
    this.gatewayPayActive = true;
    this.customPay = false;
    this.currentStep = 2;
  }

  goToBack() {
    if (this.authService.getUser().is_anonymous) {
      this.authService.logoff();
      location.href = this.config.redirectUri;
    } else {
      this.router.navigate(['policies/policy-payments']);
    }
  }

  getCustomPayMexProperties(customPayMexProperties: any) {

    this.policy.amountToPay = customPayMexProperties.paymentAgreed;
    this.valueInMexicanPesosFromUsd = customPayMexProperties.paymentAgreed;
    this.policy.amountUSDToPay = customPayMexProperties.paymentAgreedInUsd;
    this.policy.automaticDeduction = customPayMexProperties.hasAutodeduction;
    if (customPayMexProperties.confirmToPayment) {
      this.currentStep = 1;
    }
  }

  isPaymentInDollarsFromMexico() {
    const insuranceBusinessAgent = this.paymentService.getBupaInserance(this.policy);
    if (insuranceBusinessAgent === InsuranceBusiness.BUPA_MEXICO && this.policy && this.policy.fixedRate) {
      this.paymentInDollarsFromMexico = false;
    } else {
      this.paymentInDollarsFromMexico = true;
      this.isExchangeRateValid = this.policy.exchangeRate !== 1 ? true : false;
      this.valueInMexicanPesosFromUsd = this.policy.amountToPay;
    }
  }
  
  inactivityPeriod(): Boolean {
    return (this.startInactivityMxPortal < this.today) && (this.today < this.endInactivityMxPortal)
  }
}
