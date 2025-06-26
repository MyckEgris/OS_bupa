import { Component, OnInit, Input } from '@angular/core';
import { Location  } from '@angular/common';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { PaymentDto } from 'src/app/shared/services/payment/entities/paymentPolicy.dto';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { CommonService } from 'src/app/shared/services/common/common.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { CustomCurrencyPipe } from 'src/app/shared/pipes/currency/custom-currency.pipe';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';

@Component({
  selector: 'app-payment-check',
  templateUrl: './payment-check.component.html',
  providers: [CustomCurrencyPipe]
})
export class PaymentCheckComponent implements OnInit {

  @Input() policy: PolicyDto;

  public paymentForm: FormGroup;
  payment = new PaymentDto();
  private defaultDateFormat = 'MM/dd/yyyy';
  // Maximum character for check number
  public maxChars = 17;
  // Maximum character for route number
  public maxRoute = 9;

  /**
   * Title for business exception modal message
   */
  private BUSINESS_EXCEPTION_TITLE = 'Business exception';

  /**
   * Title for business exception modal message
   */
  private BUSINESS_EXCEPTION_TITLE_PAYMENT = '';

  /**
   * Title for business exception modal button message
   */
  private BUSINESS_EXCEPTION_BUTTON = '';

  /**
   * Title for business exception modal button message
   */
  private BUSINESS_BUTTON_CANCEL = '';


  private PAY_TYPE_CHECK = 2;

  // Constructor for inject services necesary
  constructor(private paymentService: PaymentService,
    private commonService: CommonService,
    private authService: AuthService,
    private fb: FormBuilder,
    private translationService: TranslationService,
    private translateService: TranslateService,
    private router: Router,
    private notification: NotificationService,
    private currencyPipeService: CustomCurrencyPipe,
    private location: Location,
    private config: ConfigurationService) {
  }


  // Init variables and form Group
  ngOnInit() {
    this.setAmountTotalToPay();
    this.buildDefaultGroup();
    this.loadErrorMessages();
    this.translateService.onLangChange.subscribe(() => {
      this.loadErrorMessages();
    });
  }

  setAmountTotalToPay() {
    this.policy.amountTotalToPay = this.policy.amountToPay;
    this.policy.amountUSDTotalToPay = this.policy.amountUSDToPay;
    this.paymentService.setPolicyToPay(this.policy);
  }

  async loadErrorMessages() {
    this.BUSINESS_EXCEPTION_TITLE_PAYMENT = await this.translateService.get('PAYMENTS.ERRORS.BUSINESS_EXCEPTION_TITLE').toPromise();
    this.BUSINESS_EXCEPTION_BUTTON = await this.translateService.get('PAYMENTS.ERRORS.BUSINESS_EXCEPTION_BUTTON').toPromise();
    this.BUSINESS_BUTTON_CANCEL = await this.translateService.get('PAYMENTS.ERRORS.BUSINESS_BUTTON_CANCEL').toPromise();
  }

  // Build default init formGroup
  buildDefaultGroup() {
    this.paymentForm = this.buildBasicForm();
  }


  /**
 * Check if response has error code to show business exception
 * @param error Http Error
 */
  checksIfHadBusinessError(error) {
    return error.error.code;
  }

  ////////////////////////////////////////////////////////////////
  // Basic form field that apply to all combinations
  buildBasicForm() {
    const formBasic: FormGroup = this.fb.group({
      accountNumber: ['', [Validators.required]],
      routeNumber: ['', [Validators.required]],
      email: ['', Validators.email],
      firstName: [this.policy.members[0].firstName, [Validators.required]],
      surnameName: [this.policy.members[0].lastName, [Validators.required]],
      amountToPay: [this.currencyPipeService.transform(this.policy.amountUSDToPay, '$'),
      [Validators.required, CustomValidator.maxAmountExceeded(this.policy.amountUSDToPay)]]
    });

    return formBasic;
  }
  ////////////////////////////////////////////////////////////////


  // Send Pay to back-end
  async payPolicy() {
    if (this.paymentForm.valid) {
      this.buildDTO();
      if (!this.payment.payment.paymentDataElectronicCheck.amountApplyUSD) {
        this.showMessageNumberInvalid();
      } else {
        this.paymentService.excecutePayment(this.payment).subscribe(p => {
          this.paymentService.setResultPayPolicy(p);
          this.paymentService.setAmountPaid(this.payment.payment.paymentDataElectronicCheck.amountApplyUSD);
          this.router.navigate(['payments/payment-process-ok', this.policy.policyId]);
        }, error => {
          if (this.checksIfHadBusinessError(error)) {
            if (error.error.code === 'BE_002') {
              this.showErrorMessage(error.error.code);
            } else {
              this.showTryAgainMessage(error.error.code);
            }
          }
        });
      }
    } else {
      this.markFormAsTouched(this.paymentForm);
    }
  }



  private markFormAsTouched(form: FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      if (control instanceof FormGroup) {
        this.markFormAsTouched(control);
      } else {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  // Construct dto with informations for send to server
  buildDTO() {
    // validate to amountopay format
    let amounToPay = null;

    // if has format currency, delete currency with pipe
    if (this.paymentForm.controls.amountToPay.value.toString().indexOf('$') > -1) {
      amounToPay = this.currencyPipeService.parse(this.paymentForm.value.amountToPay,
        this.policy.currencySymbol).replace('$', '');
    } else {
      amounToPay = this.paymentForm.controls.amountToPay.value;
    }

    let language: string;
    this.translateService.stream(this.defaultDateFormat).subscribe(format => {
      language = this.translationService.getLanguage();
    });
    this.payment.payment = {
      policy: {
        policyId: this.policy.policyId.toString(),
        policyReference: this.policy.policyReference,
        fixedRate: this.policy.fixedRate
      },
      businessId: this.paymentService.getBupaInserance(this.policy),
      paymentMethodId: this.PAY_TYPE_CHECK,
      paymentDataElectronicCheck: {
        accountFirstName: this.paymentForm.value.firstName,
        accountLastName: this.paymentForm.value.surnameName,
        amountApplyUSD: Number(amounToPay),
        accountNumber: this.paymentForm.value.accountNumber,
        routingNumber: this.paymentForm.value.routeNumber,
        currencyId: this.policy.currencyId,
        exchangeRate: this.policy.exchangeRate
      }
    };

    this.payment.notification = {
      language: language,
      emails: [this.authService.getUser().sub, this.paymentForm.value.email]
    };
  }

  /**
  * Uses notification service to show modal popup with a title and a message
  * @param message Message
  */
  async showTryAgainMessage(errorCode) {
    const message = await this.translateService.get('PAYMENTS.ERRORS.' + errorCode).toPromise();
    const tryAgain = await this.notification.showDialog
      (this.BUSINESS_EXCEPTION_TITLE_PAYMENT, message, true, this.BUSINESS_EXCEPTION_BUTTON, this.BUSINESS_BUTTON_CANCEL);
    if (tryAgain) {
      this.payPolicy();
    }
  }

  /**
   * @param errorCode Business Error Code
   */
  async showErrorMessage(errorCode: string) {
    const message = await this.translateService.get('PAYMENTS.ERRORS.' + errorCode).toPromise();
    const title = await this.translateService.get('PAYMENTS.ERRORS.' + errorCode + '_TITLE').toPromise();
    const ok = await this.notification.showDialog(title, message);
    if (ok) {
      this.finishOnError();
    }
  }

  /**
   * Finish on Error.
   */
  finishOnError() {
    if (this.authService.getUser().is_anonymous) {
      this.authService.logoff();
      location.href = this.config.redirectUri;
    } else {
      this.router.navigate(['policies/policy-payments']);
    }
  }

  // get basic Controls
  get basicsControls() {
    return (this.paymentForm as FormGroup).controls;
  }

  goToBack() {
    this.location.back();
  }

  showMessageNumberInvalid() {
    let message = '';
    let messageTitle = '';
    this.translateService.get(`PAYMENTS.ERRORS.NUMBER_INVALID`).subscribe(
      result => message = result
    );
    this.translateService.get(`PAYMENTS.ERRORS.ERROR`).subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);
  }

}
