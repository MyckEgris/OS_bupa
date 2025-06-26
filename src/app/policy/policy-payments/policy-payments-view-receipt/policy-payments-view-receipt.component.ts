import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { TranslationService } from 'src/app/shared/services/translation/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PaymentDto } from 'src/app/shared/services/policy/entities/payment.dto';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { PolicyResponse } from 'src/app/shared/services/policy/entities/policy-response.dto';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { PaymentMethodCreditCard } from 'src/app/shared/classes/paymentMethodCreditCard.enum';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { ConstansParamPolicies } from 'src/app/shared/services/policy/constants/constant-param-policies';

@Component({
  selector: 'app-policy-payments-view-receipt',
  templateUrl: './policy-payments-view-receipt.component.html'
})
export class PolicyPaymentsViewReceiptComponent implements OnInit, AfterViewInit {

  /**
   * Flag for button visible
   */
  public buttonVisible = true;

  /**
   * Stores the logged user information
   */
  public user: UserInformationModel;

  /**
   * PolicyApplication Dto object
   */
  private policyResponse: PolicyResponse = { count: 0, pageindex: 1, pageSize: 0, data: [] };

  /**
   * PolicyDto
   */
  public policyDto: PolicyDto;

  public paymentDto: PaymentDto;

  public today: Date = new Date;

  /**
   * Constant for error code status # 404
   */
  private ERROR_STATUS_FOR_DATA_NOT_FOUND = 404;

  public policyId: number;

  private paymentNumber: number;

  public showAmountUSD: Boolean = true;

  public paymentMethodCreditCard = false;

  public bupaInsuranceCompany: string;

  public showAmountMXN: Boolean = false;

  public captchaSiteKey: string;
  private captchaResponse: string;

  @ViewChild('btonClick') btonClick: ElementRef;

  constructor(
    private config: ConfigurationService,
    private translate: TranslateService,
    private translation: TranslationService,
    private route: ActivatedRoute,
    private policyService: PolicyService,
    private authService: AuthService,
    private notification: NotificationService,
    private paymentService: PaymentService) {
    this.captchaSiteKey = this.config.googleCaptchaSiteKeyInvisible;
  }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.translation.setLanguage(this.translation.getLanguage(), this.user.bupa_insurance);
    this.policyId = this.route.snapshot.queryParams['policyNumber'];
    console.log(this.policyId);
    this.paymentNumber = this.route.snapshot.queryParams['paymentId'];
    console.log(this.paymentNumber);;
  }

  ngAfterViewInit(): void {
    if (this.user.is_anonymous) {
      this.btonClick.nativeElement.click();
    } else {
      this.getPolicyById();
      this.getInfoPayment();
    }
  }

  showAmountMexicanPeso() {
    return this.paymentService.getBupaInserance(this.policyDto) === InsuranceBusiness.BUPA_MEXICO;
  }

  getInfoPayment() {
    if (this.paymentNumber) {
      this.infoPaymentByPaymentIdByPolicyId();
    } else {
      this.policyService.getLastPayment(this.policyId).subscribe(
        (data: PolicyDto) => {
          this.paymentNumber = data.payments[0].paymentId;
          this.getDataReceiptPayment();
        },
        error => {
          this.handlePolicyAppError(error);
        });
    }
  }

  getDataReceiptPayment() {
    this.policyService.getPaymentsByPolicyIdReturnPayment(this.policyId).subscribe(
      (data: PaymentDto[]) => {
        this.assignDataPayment(data);
      },
      error => {
        this.handlePolicyAppError(error);
      });
  }

  getPolicyById() {
    this.policyService.getPolicyByPolicyId(this.user.role_id,
      this.user.user_key, true, this.policyId).subscribe(
        data => {
          this.policyResponse = data;
          this.assignDataPolicy(this.policyResponse.data[0]);
        },
        error => {
          this.handlePolicyAppError(error);
        });
  }

  /****
   * Get Information Payment When User Is Anonymous
   */
  private infoPaymentByPaymentIdByPolicyIdIsAnonymous() {
    this.policyService.getPaymentsByPaymentIdByPolicyIdIsAnonymous(this.policyId,
      this.paymentNumber,
      this.captchaResponse,
      ConstansParamPolicies.INVISIBLE,
      true).subscribe(
        data => {
          this.assignDataPolicy(data);
          this.assignDataPayment(data.payments);
        },
        error => {
          this.handlePolicyAppError(error);
        }
      );
  }

  /****
   * Get Information Payment When User
   */
  private infoPaymentByPaymentIdByPolicyId() {
    this.policyService.getPaymentsByPaymentIdByPolicyId(this.policyId,
      this.paymentNumber).subscribe(
        data => {
          this.assignDataPolicy(data);
          this.assignDataPayment(data.payments);
        },
        error => {
          this.handlePolicyAppError(error);
        }
      );
  }

  /***
   * Set data show payment
   */
  assignDataPayment(data: PaymentDto[]) {
    this.paymentDto = data.filter(x => x.paymentId.toString() === this.paymentNumber.toString())[0];
    this.paymentMethodCreditCard = (PaymentMethodCreditCard.toKeyValueArray(PaymentMethodCreditCard).
      findIndex(x => x.value === this.paymentDto.paymentMethodId) > -1);
  }

  /***
   * Set data show policy
   */
  assignDataPolicy(policy: PolicyDto) {
    this.policyDto = policy;
    this.showAmountMXN = this.showAmountMexicanPeso();
    this.showAmountDolar();
  }

  /***
  * handles Policy App Error
  */
  private handlePolicyAppError(error: any) {
    if (this.checksIfHadBusinessError(error)) {
      this.showErrorMessage(error);
    }
  }

  checksIfHadBusinessError(error) {
    return error.error.message;
  }

  /**
   * Check if status is 404 and show message for data not found
   * @param error Http Error
   */
  checksIfHadNotFoundError(error) {
    return (error.status === this.ERROR_STATUS_FOR_DATA_NOT_FOUND);
  }

  private showErrorMessage(errorMessage: HttpErrorResponse) {
    let message = '';
    let messageTitle = '';
    this.translate.get(`APP.MESSAGE_RECEIPT_PAYMENT`).subscribe(
      result => message = result
    );
    this.translate.get(`APP.RESULTADO_BUSQUEDA`).subscribe(
      result => messageTitle = result
    );

    const vble = this.notification.showDialog(messageTitle, message, false, '', '', false, '', false, '', true);
  }

  /**
   * Delay for print
   * @param ms Milliseconds
   */
  async delay(ms: number) {
    return await new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Prints member elegibility document.
   */
  printDetailReceipt() {
    this.buttonVisible = false;
    this.delay(500).then(
      () => {
        window.print();
        this.buttonVisible = true;
      }
    );
  }

  showAmountDolar() {
    if (!this.policyDto.fixedRate) {
      this.showAmountUSD = true;
    } else {
      this.showAmountUSD = false;
    }
  }

  /**
   * Event from captcha when is clicked
   * @param event Event
   */
  public resolved(captchaResponse: string) {
    this.captchaResponse = captchaResponse;
    this.infoPaymentByPaymentIdByPolicyIdIsAnonymous();
  }


}
