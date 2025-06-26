/**
* Component for sucessful payments
*
* @description: This class receive sucessful payments from Santander Bank
* @author Edwin Javier Sanabria Mesa.
* @version 1.0
* @date 11-07-2020.
*
**/
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { TransactionResponseDto } from 'src/app/shared/services/payment/entities/transactionResponse.dto';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-payment-result-mex-ok',
  templateUrl: './payment-result-mex-ok.component.html'
})
export class PaymentResultMexOkComponent implements OnInit {

  public policyId: any;
  public paymentReference: string;
  public amount: string;
  public brand: string;
  public authorization: string;
  public operation: string;
  public user: UserInformationModel;
  public isAuserAnonymous: boolean;
  public logId: string;
  private paymentId: number;
  public isPaymentCompleted = false;
  public isProcessing = true;
  public datePayment: string;
  public cardNumber: string;
  public numberIntent: number = 0;
  public idInterval: NodeJS.Timer;

  private ERROR_404 = 404;
  private ERROR_400 = 400;
  private ERROR_500 = 500;
  private TIME_TO_INTERVAL = 20000;
  private NUMBER_MAX_INTENTS = 3;

  constructor(private activeRouter: ActivatedRoute,
    private authService: AuthService,
    private config: ConfigurationService,
    private router: Router,
    private paymentService: PaymentService,
    private notification: NotificationService) { }

  ngOnInit() {
    this.setUserType();
    this.activeRouter.params.subscribe(params => {
      this.setPaymentProperties(params);
    });
    
    this.idInterval = setInterval(() => {
      this.verifyPayment();
    }, this.TIME_TO_INTERVAL);

    setTimeout(() => {
      this.stopInterval();
    }, 90000);

  }

  setUserType() {
    this.user = this.authService.getUser();
    this.isAuserAnonymous = this.user.is_anonymous != null  ? true : false;
  }

  setPaymentProperties(params: Params) {
    this.policyId = +params['policyId'];
    this.paymentReference = params['paymentReference'];
    this.amount = params['amount'];
    this.brand = params['brand'];
    this.authorization = params['authorization'];
    this.operation = params['operation'];
    this.logId = params['logId'];
    this.datePayment = atob(params['datePayment']);
  }

  goToBack() {
    if (this.isAuserAnonymous) {
      this.authService.logoff();
      location.href = this.config.redirectUri;
    } else {
      this.router.navigate(['policies/policy-payments']);
    }
  }

  verifyPayment() {
    // tslint:disable-next-line: max-line-length
    if (this.numberIntent === this.NUMBER_MAX_INTENTS) {
      this.stopInterval();
    } else {
      this.paymentService.getTransactionStatus(this.paymentService.buildGeTransactionStatus(this.logId, this.policyId)).subscribe(response => {
        this.buildUserResponse(response);
      }, error => {
        let response = null;
        if (this.checkIfBadRequest(error)) {
          response = this.notification.showDialog('PAYMENTS.ERRORS.BUSINESS_EXCEPTION_TITLE',
            'PAYMENTS.ERRORS.ERROR_WITH_DATA');
        }
        if (this.checkIfInternalServerError(error)) {
          response = this.notification.showDialog('PAYMENTS.ERRORS.BUSINESS_EXCEPTION_TITLE',
            'PAYMENTS.ERRORS.ERROR_WITH_SERVER');
        }
        if (response) {
          this.stopInterval();
          this.router.navigate(['policies/policy-payments']);
        }
        this.numberIntent++;
      });
    }
  }

  checkIfBadRequest(error) {
    return (error.status === this.ERROR_400 || error.status === this.ERROR_404);
  }

  checkIfInternalServerError(error) {
    return (error.status === this.ERROR_500);
  }

  buildUserResponse(transactionResponse: TransactionResponseDto) {
    this.paymentId = transactionResponse.payment.paymentId;
    this.cardNumber = transactionResponse.payment.cardNumber;
    if (this.paymentId > 0) {
      this.stopInterval();
      this.isPaymentCompleted = true;
    }
  }

  stopInterval() {
    clearInterval(this.idInterval);
    this.isProcessing = false;
  }

}
