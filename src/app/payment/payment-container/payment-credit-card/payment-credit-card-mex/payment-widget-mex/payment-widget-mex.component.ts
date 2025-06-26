/**
* Payment Widget for Mexican payments
*
* @description: This class shows the payment form to mexican payment
* @author Edwin Javier Sanabria Mesa.
* @version 1.0
* @date 10-07-2020.
*
**/

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { DecimalPipe, Location } from '@angular/common';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { PolicyResponse } from 'src/app/shared/services/policy/entities/policy-response.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-payment-widget-mex',
  templateUrl: './payment-widget-mex.component.html',
  providers: [DecimalPipe]
})
export class PaymentWidgetMexComponent implements OnInit {

  @Input() policy: PolicyDto;
  @Input() isChecked = false;
  @Output() sendCustomPayMexProperties: EventEmitter<any> = new EventEmitter();

  currencySymbol: string;
  valueInMexicanPesos: number;
  policyAmount: string;
  policyAmountInUsd: number;
  txtCustomPayMex: any;
  public paymentInMexicanPesos: boolean;
  public confirmToPayment: boolean;
  public user: UserInformationModel;
  public isAuserAnonymous: boolean;
  public MONTHLY_PAYMENT = 'Monthly';
  public QUARTERLY_PAYMENT = 'Quarterly';
  public POLICY_WITH_AUTODEDUCTION_MARK = 'PolicyWithAutodeduction'; 
  public automaticAutodeduction = false;
  public showPaymentValidationResult = false;
  public showPaymentUSDEquivalentValidationResult = false;
  public isDisabled = false;
  isExchangeRateValid = true;
  

  constructor(private authService: AuthService,
    private paymentService: PaymentService,
    private config: ConfigurationService,
    private translate: TranslateService,
    private decimalPipe: DecimalPipe,
    private policyService: PolicyService,
    private notification: NotificationService,
    private router: Router) { }

  ngOnInit() {
    this.getInitialValues();
    this.isPaymentInMexicanPesos();
    this.setUserType();
    this.getPolicyAdditionalInformation(this.policy.policyId);
    //this.validateModeOfPayment();
  }

  // get accessor
  get value(): any {
    return this.isChecked;
  }

  // set accessor including call the onchange callback
  set value(value: any) {
    this.isChecked = value;
  }

  getInitialValues() {
    this.currencySymbol = this.paymentService.getCurrencyCode(this.policy);
    this.policyAmount = this.policy.amountToPay.toString();
  }


  customPayValidation(event) {
    this.confirmToPayment = false;
    let newAmountToPay = null;
    if (event.target.value != null && event.target.value !== '' && Number(event.target.value) > 0
      && String(Math.trunc(Number(event.target.value))).length <= 7) {
      newAmountToPay = event.target.value;
      this.showPaymentValidationResult = false;
      this.isDisabled = false;
    } else {
      newAmountToPay = this.policy.amountToPay;
      this.showPaymentValidationResult = true;
      this.isDisabled = true;
    }

    if (this.paymentInMexicanPesos) {
      this.policy.amountToPay = newAmountToPay;
      this.valueInMexicanPesos = newAmountToPay;
      this.policy.amountUSDToPay = this.getNewPolicyValueInUSD(newAmountToPay);
      this.checkQuantity(this.policy.amountUSDToPay);
    } else {
      this.policy.amountToPay = newAmountToPay;
      this.valueInMexicanPesos = this.getNewPolicyValueInMXN(newAmountToPay);
      this.policy.amountUSDToPay = newAmountToPay;
      this.checkQuantity(this.policy.amountUSDToPay);
      this.buildCustomPay();
    }

  }

  checkQuantity(amount: number) {
    if (amount < 1) {
      this.showPaymentUSDEquivalentValidationResult = true;
      this.isDisabled = true;
    } else {
      this.showPaymentUSDEquivalentValidationResult = false;
      this.isDisabled = false;
    }
  }

  getNewPolicyValueInMXN(amount: number) {
    return amount / this.policy.exchangeRate;
  }

  getNewPolicyValueInUSD(amount: number) {
    return amount * this.policy.exchangeRate;
  }

  onChange(isChecked) {
    this.value = isChecked;
  }

  onClickPaymentContinue() {
    if (!this.isDisabled) {
      this.showPaymentValidationResult = false;
      this.confirmToPayment = true;
      this.buildCustomPay();
    } else {
      this.showPaymentValidationResult = true;
    }
  }

  buildCustomPay() {
    const customPayProperties = {
      policyId: this.policy.policyId,
      paymentAgreed: this.valueInMexicanPesos,
      paymentAgreedInUsd: this.policy.amountUSDToPay,
      confirmToPayment: this.confirmToPayment,
      hasAutodeduction: this.isChecked
    };

    this.sendCustomPayMexProperties.emit(customPayProperties);
  }

  isPaymentInMexicanPesos() {

    const insuranceBusinessAgent = this.paymentService.getBupaInserance(this.policy);
    if (insuranceBusinessAgent === InsuranceBusiness.BUPA_MEXICO && this.policy && this.policy.fixedRate) {
      this.txtCustomPayMex = this.decimalPipe.transform(this.policy.amountToPay, '1.2-2');
      this.valueInMexicanPesos = this.policy.amountToPay;
      this.paymentInMexicanPesos = true;
    } else {
      this.isExchangeRateValid = this.policy.exchangeRate !== 1 ? true : false;
      this.txtCustomPayMex = this.policy.amountUSDToPay;
      this.policyAmountInUsd = this.policy.amountUSDToPay;
      this.paymentInMexicanPesos = false;
      this.valueInMexicanPesos = this.getNewPolicyValueInMXN(this.policy.amountUSDToPay);
    }
  }

  setUserType() {
    this.user = this.authService.getUser();
    this.isAuserAnonymous = this.user.is_anonymous != null ? true : false;
  }

  /*validateModeOfPayment() {  
    if ((this.policy.modeOfPayment === this.MONTHLY_PAYMENT ||
      this.policy.modeOfPayment === this.QUARTERLY_PAYMENT ) && !this.isAuserAnonymous) {
      this.automaticAutodeduction = true;
      this.isChecked = true;
    }
  }*/
 /*validateModeOfPayment(policyDto: PolicyDto) {  
    if ((this.policy.modeOfPayment === this.MONTHLY_PAYMENT ||
      this.policy.modeOfPayment === this.QUARTERLY_PAYMENT || 
      policyDto.paymentStatus === this.POLICY_WITH_AUTODEDUCTION_MARK) && !this.isAuserAnonymous) {
      this.automaticAutodeduction = true;
      this.isChecked = true;
    }
  }*/
  validateModeOfPayment(paymentStatus: string) {  
    if ((this.policy.modeOfPayment === this.MONTHLY_PAYMENT ||
      this.policy.modeOfPayment === this.QUARTERLY_PAYMENT || 
      paymentStatus === this.POLICY_WITH_AUTODEDUCTION_MARK) && !this.isAuserAnonymous) {
      this.automaticAutodeduction = true;
      this.isChecked = true;
    }
  }

   /**
   * Get policy Additional Information
   * @param policyId Policy number
   */
  getPolicyAdditionalInformation(policyId: number) {
    
    this.policyService.getPolicyByPolicyId(this.user.role_id, this.user.user_key, true, policyId)
      .subscribe(
        data => {
          var paymentStatus = data.data[0].paymentStatus;
          //this.validateModeOfPayment(data.data[0]);
          this.validateModeOfPayment(paymentStatus);
        }, error => {
          this.handlePolicyError(error);
        });
  }

  private handlePolicyError(error: any) {
    if (error.status === 404) {
    } else if (this.checksIfHadBusinessError(error)) {
      this.showErrorMessage(error);
    }
  }
  /**
   * Check if response has error code to show business exception
   * @param error Http Error
   */
   checksIfHadBusinessError(error) {
    return error.error.code;
  }

  private showErrorMessage(errorMessage: HttpErrorResponse) {
    let message = '';
    let messageTitle = '';
    this.translate.get(`POLICY.ERROR.ERROR_CODE.${errorMessage.error.code}`).subscribe(
      result => message = result
    );
    this.translate.get(`POLICY.ERROR.ERROR_MESSAGE.${errorMessage.error.code}`).subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);
  }

}
