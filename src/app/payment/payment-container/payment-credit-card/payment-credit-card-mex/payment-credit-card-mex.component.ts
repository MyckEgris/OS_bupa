/**
* Component for the mexican pay
*
* @description: This class management the mexican payment
* @author Edwin Javier Sanabria Mesa.
* @version 1.0
* @date 11-07-2020.
*
**/
import { Component, OnInit, Input, HostListener, ViewChild, ElementRef, Renderer2, Output, EventEmitter } from '@angular/core';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { TransactionDto } from 'src/app/shared/services/payment/entities/transaction.dto';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Router } from '@angular/router';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { PaymentResponseDto } from 'src/app/shared/services/payment/entities/paymentResponse.dto';
import { TransactionResponseDto } from 'src/app/shared/services/payment/entities/transactionResponse.dto';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';
import { stringify } from 'querystring';

@Component({
  selector: 'app-payment-credit-card-mex',
  templateUrl: './payment-credit-card-mex.component.html'
})
export class PaymentCreditCardMexComponent implements OnInit {

  @Input() policy: PolicyDto;
  @Output() iframeClick = new EventEmitter<ElementRef>();
  public payurl: string;
  public bupaInsurance: number;
  transaction: TransactionDto;
  paymentResponseTransactionDto: TransactionDto;
  isProcessing = false;
  private iframeMouseOver: boolean;
  public showLoading = false;
  private transactionLogId: string;
  counter = 0;
  private ERROR_404 = 404;
  private ERROR_400 = 400;
  private ERROR_401 = 401;
  private errorInWebPayResponse = false;

  @HostListener('window:message', ['$event']) onPostMessage(event) {
    this.payurl = '';
    const isUrlAuthorize = this.validateUrlIsAuthorized(event);
    if (isUrlAuthorize !== true) {
      return false;
    }

    if (event.data.nbResponse != null && event.data.nbResponse === 'Aprobado') {
      const dateIn64Base = btoa(event.data.fecha);
      // tslint:disable-next-line: max-line-length
      this.router.navigate([`payments/payment-bank-result-mex/ok/${this.policy.policyId}/${event.data.referenciaPayment}/${event.data.importe}/${event.data.marca}/${event.data.nuAut}/${event.data.operacion}/${this.transactionLogId}/${dateIn64Base}`]);
    } else if (event.data.nbResponse != null && event.data.nbResponse === 'Rechazado') {

      const error = event.data.nb_error !== null && event.data.nb_error !== ''
        && event.data.nb_error !== 'undefined' ? event.data.nb_error : '_';
      this.router.navigate([`payments/payment-bank-result-mex/error/${error}`]);
    }
  }
  constructor(
    private paymentService: PaymentService,
    private auth: AuthService,
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router,
    private config: ConfigurationService,
    private notification: NotificationService
  ) { }

  ngOnInit() {
    this.payurl = '';
    // tslint:disable-next-line: max-line-length
    this.paymentService.startTransaction(this.paymentService.buildStartTransactionRequest(+this.auth.getUser(), this.policy)).subscribe(response => {
      this.iframeLoadFinished();
      this.payurl = response.transactionUrl;
      sessionStorage.setItem(this.config.KEY_POLICY_ID, this.policy.policyId.toString());
      this.setTransactionLogId(response.transactionLogId);
    }, error => {
      this.showLoading = false;
      this.errorInWebPayResponse = true;
      let response = null;
      if (this.checkIfBadRequest(error)) {
        response = this.notification.showDialog('APP.HTTP_ERRORS.ERROR_TITLE.400',
          'PAYMENTS.ERRORS.ERROR_WITH_DATA');
      } else if (this.checkIfUnauthorizedError(error)) {
        response = this.notification.showDialog('APP.HTTP_ERRORS.ERROR_TITLE.401',
          'APP.HTTP_ERRORS.ERROR_MESSAGE.401');
      } else {
        response = this.notification.showDialog('APP.HTTP_ERRORS.ERROR_TITLE.500',
          'APP.HTTP_ERRORS.ERROR_MESSAGE.500');
      }
      if (response) {
        this.router.navigate(['policies/policy-payments']);
      }
    });
    this.isProcessing = true;
  }

  setTransactionLogId(transactionLogId: string) {
    this.transactionLogId = transactionLogId;
  }

  checkIfBadRequest(error) {
    return (error.status === this.ERROR_400 || error.status === this.ERROR_404);
  }


  checkIfUnauthorizedError(error) {
    return (error.status === this.ERROR_401);
  }

  validateUrlIsAuthorized(inputEvent) {
    return inputEvent.origin === this.getUrl() ? true : false;
  }

  getUrl(): any {
    return window.location.origin;
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async iframeLoadFinished() {
    await this.delay(25000);
    this.showLoading = true;
  }


}
