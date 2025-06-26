import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { FormGroup, FormControl, ValidatorFn, AbstractControl, FormBuilder, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CustomValidator } from 'src/app/shared/validators/custom.validator';
import { ConstansParamPolicies } from 'src/app/shared/services/policy/constants/constant-param-policies';
import { IStorage, StorageKind } from 'src/app/shared/services/cache/cache.index';
import { CacheService } from 'src/app/shared/services/cache/cache.service';

@Component({
  selector: 'app-policy-payments-without-logging',
  templateUrl: './policy-payments-without-logging.component.html'
})
export class PolicyPaymentsWithoutLoggingComponent implements OnInit, OnDestroy {
  /**
   * Main form
   */
  public policyPaymentLoggin: FormGroup;
  private captchaResponsePrev: string;

  public captchaSiteKey: string;
  private captchaResponse: string;
  public languaje: string;

  public dateMaxDOB: Date = new Date();
  public dateMinDOB: Date;

  private next: Boolean = false;

  public isDisableOnlyInput: Boolean = true;

  public startInactivityMxPortal: Date;
  public endInactivityMxPortal: Date;
  public today: Date;


  /**
   * local Storage
   */
  private localStorage: IStorage;

  /**
   * Constant for postLoginRoute
   */
  private POST_LOGIN_ROUTE = 'postLoginRoute';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private config: ConfigurationService,
    private authService: AuthService,
    private policyService: PolicyService,
    private paymentService: PaymentService,
    private translate: TranslateService,
    private notification: NotificationService,
    private cache: CacheService,
    private fb: FormBuilder,
  ) {
    this.captchaSiteKey = this.config.googleCaptchaSiteKey;
    this.localStorage = this.cache.storage(StorageKind.InLocalStorage);
    this.today = new Date();
    this.startInactivityMxPortal = new Date(this.config.inactivityMXPortal.split('|')[0]);
    this.endInactivityMxPortal = new Date(this.config.inactivityMXPortal.split('|')[1]);
  }

  ngOnInit() {
    this.localStorage.delete(this.POST_LOGIN_ROUTE);
    this.setMinDate();
    this.languaje = this.route.snapshot.queryParams['policyNumber'];
    this.buildForm();

  }

  ngOnDestroy(): void {
    if (this.next !== true) {
      this.cancel();
    }
  }

  /**
   * Builds default policyPaymentLoggin Form.
   */
  buildForm() {
    this.policyPaymentLoggin = this.fb.group({
      basics: this.buildBasicForm(),
    });
  }

  buildBasicForm() {
    const formBasic: FormGroup = this.fb.group({
      policyId: ['', [Validators.required, CustomValidator.onlyInt()]],
      dob: ['', [Validators.required, CustomValidator.datePickerValidator]],
      captcha: ['', [Validators.required]]
    });
    return formBasic;
  }

  /**
   * Event from captcha when is clicked
   * @param event Event
   */
  public resolved(captchaResponse: string) {
    this.captchaResponse = captchaResponse;
  }

  /***
   * Validate recapta
   */
  validateRecaptcha(): Boolean {
    if (this.captchaResponse === this.captchaResponsePrev) {
      this.resetCaptcha();
      return false;
    } else {
      this.captchaResponsePrev = this.captchaResponse;
      return true;
    }
  }

  validateForm() {
    if (this.validateRecaptcha()) {
      if (this.policyPaymentLoggin.valid) {
        this.continue();
      } else {
        this.markFormAsTouched(this.policyPaymentLoggin);
      }
    }
  }

  continue() {
    this.policyService.getPolicyByPolicyIdAndAnonymous(Number(this.policyPaymentLoggin.value.basics.policyId),
      this.captchaResponse, true, this.authService.getUser().is_anonymous, ConstansParamPolicies.IM_NOT_AROBOT,
      this.policyPaymentLoggin.value.basics.dob).subscribe(
        data => {
          if (this.paymentService.validateCanMakePayment(data)) {
            this.next = true;
            this.payPolicy(data);
          } else {
            this.showMessageBupaCannotMakePayment();
          }
        },
        error => {
          this.handlePolicyError(error);
        }
      );
  }

  /***
   * Show Message Bupa Can not Make Payment
   */
  private showMessageBupaCannotMakePayment(): void {
    let message = '';
    let messageTitle = '';
    this.translate.get(`PAYMENTS.PAYMENT_WITHOUT_LOGGIN.ERROR.ERROR_MESSAGE.BUPA_NOT_AUTHORIZED`).subscribe(
      result => message = result
    );
    this.translate.get(`PAYMENTS.PAYMENT_WITHOUT_LOGGIN.ERROR.ERROR_CODE.MESSAGE_ERROR_NOT_FOUND`).subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);
  }

  /***
   * Navigate to payment process, before validate field exchange rate if is country mexico
   *  */
  private payPolicy(policyObject: PolicyDto) {
    if (policyObject.paymentStatus) {
      this.resetCaptcha();
      this.paymentService.showMessagePaymentStatus(policyObject);
    } else {
      if (this.paymentService.validtePayPolicy(policyObject)) {
        this.paymentService.setPolicyToPay(policyObject);
        this.router.navigate(['payments/payment-process', policyObject.policyId]);
      } else {
        // this.notification.showDialog('Mensaje', 'Este sera el cuerpo del mensaje cuando halla error', false,
        // 'CLAIMSUBMISSION.STEP3VALIDATEXMLOKBUTTON');
      }
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

  cancel() {
    this.authService.logoff();
    location.href = this.config.redirectUri;
  }

  /***
 * handles Policy Error
 */
  private handlePolicyError(error: any) {
    if (error.status === 404) {
      this.resetCaptcha();
      this.showMessageError();
    }
    else if (error.error.code == 'BE_025') {
      this.resetCaptcha();
      this.showMessageErrorTPA(error.error.code);
    }
    else if(error.error.code == 'BE_020'){
        this.translate.get(`PAYMENTS.PAYMENT_WITHOUT_LOGGIN.ERROR.ERROR_MESSAGE.BUSINESSOFFSIDE_MESSAGE`)
          .subscribe(res => {
            this.translate.get('PAYMENTS.PAYMENT_WITHOUT_LOGGIN.ERROR.ERROR_MESSAGE.BUSINESSOFFSIDE_COSTUMERSERVICE').subscribe(res2 => {
              res = res.replace("{0}",this.config.splitRedirectUrl);
              res2 = res2.replaceAll("{0}",this.config.mexicoCostumerServicePhone);
              res2 = res2.replaceAll("{1}",this.config.mexicoCostumerServiceMail);
              res2 = res2.replaceAll("{2}",this.config.bglaCostumerServicePhone);
              res2 = res2.replaceAll("{3}",this.config.bglaCostumerServiceMail);
              res = res.concat(res2);
              this.showBusinessOffsideMessage(res);
            });
          });
    }
    else if (this.checksIfHadBusinessError(error)) {
      // this.showErrorMessage(error);
    }
  }

  resetCaptcha() {
    this.basicsControls.captcha.setValue(null);
    this.captchaResponse = null;
  }

  /**
    * Check if response has error code to show business exception
    * @param error Http Error
    */
  checksIfHadBusinessError(error) {
    return error.error.code;
  }

  showMessageError() {
    let message = '';
    let messageTitle = '';
    this.translate.get(`PAYMENTS.PAYMENT_WITHOUT_LOGGIN.ERROR.ERROR_MESSAGE.MESSAGE_ERROR_NOT_FOUND`).subscribe(
      result => message = result
    );
    this.translate.get(`PAYMENTS.PAYMENT_WITHOUT_LOGGIN.ERROR.ERROR_CODE.MESSAGE_ERROR_NOT_FOUND`).subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);
  }
  showMessageErrorTPA(errorCode) {
    let message = '';
    let messageTitle = '';
    this.translate.get(`PAYMENTS.PAYMENT_WITHOUT_LOGGIN.ERROR.ERROR_MESSAGE.`+errorCode).subscribe(
      result => message = result
    );
    this.translate.get(`PAYMENTS.PAYMENT_WITHOUT_LOGGIN.ERROR.ERROR_CODE.MESSAGE_ERROR_NOT_FOUND`).subscribe(
      result => messageTitle = result
    );
    this.notification.showDialog(messageTitle, message);
  }
  // get basic Controls
  get basicsControls() {
    return (this.policyPaymentLoggin.controls.basics as FormGroup).controls;
  }

  /***
   * Set Min Date
   */
  setMinDate() {
    const d = new Date();
    const year = d.getFullYear();
    const month = d.getMonth();
    const day = d.getDate();
    this.dateMinDOB = new Date(year - 150, month, day);
  }

  /**
   * Uses notification service to show modal popup with a title and a message for OffsideBusiness
   * @param message Message
   */
  private showBusinessOffsideMessage(message) {
    this.translate.get('PAYMENTS.PAYMENT_WITHOUT_LOGGIN.ERROR.ERROR_MESSAGE.BUSINESSOFFSIDE_TITLE').subscribe(validateTitle => {
      this.notification.showDialog(validateTitle, message);
    });
  }

  inactivityPeriod(): Boolean {
    //console.log("Start: " + this.startInactivityMxPortal + " End: " + this.endInactivityMxPortal + " Hoy es: " + this.today);
    return (this.startInactivityMxPortal < this.today) && (this.today < this.endInactivityMxPortal)
  }
}

