import { Component, OnInit } from '@angular/core';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { PaymentResponseDto } from 'src/app/shared/services/payment/entities/paymentResponse.dto';
import { TransactionDto } from 'src/app/shared/services/payment/entities/transaction.dto';
import { TransactionResponseDto } from 'src/app/shared/services/payment/entities/transactionResponse.dto';

@Component({
  selector: 'app-payment-result-ecu',
  templateUrl: './payment-result-ecu.component.html'
})
export class PaymentResultEcuComponent implements OnInit {

  public id: string;
  public resourcePath: string;
  public policyId: number;
  public transactionLogId: string;
  // Object Policy search
  public policy: PolicyDto;
  constructor(private activeRouter: ActivatedRoute,
    private paymentService: PaymentService,
    private policyService: PolicyService,
    private authService: AuthService,
    private configurationService: ConfigurationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getQueryParams();
    this.getParams();
    const user = this.authService.getUser();
    this.getDetailPolicy();
    this.applyTransaction();
  }

  getDetailPolicy() {
    this.policy = JSON.parse(atob(sessionStorage.getItem(this.configurationService.KEY_POLICY)));
    // this.policy = this.policyService.getPolicyDto();
  }

  applyTransaction() {
    const requestApply = this.paymentService.buildApplyTransactionRequest(
      +this.authService.getUser(), this.policy, this.id, this.transactionLogId);
    this.paymentService.confirmTransaction(requestApply).subscribe(response => {
      if (this.checkIfPaymentWasGenerated(response)) {
        this.setPolicyDataForPayment(response);
        this.router.navigate([`/payments/payment-process-ok/${this.policy.policyId}`]);
        // transactionStatusId
      } else {
        this.setPolicyError(response);
        this.router.navigate([`/payments/payment-process-error/${this.policy.policyId}`]);
      }
    }, error => {
      if (this.checksIfHadBusinessError(error)) {
        if (error.error.code === 'BE_002') {
          this.paymentService.setResultPayPolicy(this.buildFakePaymentResponse(requestApply));
          this.paymentService.setAmountPaid(requestApply.payment.paymentDataCreditCard.amountApplyUSD);
          this.router.navigate([`/payments/payment-process-ok/${this.policy.policyId}`]);
        } else {
          this.setPolicyError(error);
          this.router.navigate([`/payments/payment-process-error/${this.policy.policyId}`]);
        }
      }
    });
  }

  checksIfHadBusinessError(error) {
    return error.error.code;
  }

  buildFakePaymentResponse(requestApply) {
    return {
      paymentId: 0,
      policyId: this.policy.policyId,
      amountApplyedUSD: requestApply.payment.paymentDataCreditCard.amountApplyUSD,
      authorizationCode: '',
      cardNumber: ''
    };
  }

  setPolicyDataForPayment(response) {
    // this.paymentService.setPaymentResponse(this.policy, response);
    this.paymentService.setAmountPaid(response.payment.amountApplyedUSD);
    this.paymentService.setPolicyToPay(this.policy);
    const paymentResponse = this.setPaymentResponse(response.payment);
    this.paymentService.setResultPayPolicy(paymentResponse);
  }

  setPaymentResponse(paymentResponse): PaymentResponseDto {
    return {
      paymentId: paymentResponse ? paymentResponse.paymentId : 0,
      policyId: paymentResponse ? paymentResponse.policyId : this.policyId,
      amountApplyedUSD: paymentResponse ? paymentResponse.amountApplyedUSD : 0,
      authorizationCode: paymentResponse ? paymentResponse.authorizationCode : '',
      cardNumber : paymentResponse ? paymentResponse.cardNumber  : ''
    };
  }

  setPolicyError(response) {
    this.paymentService.setErrorPayPolicy(this.setError(response));
    const paymentResponse = this.setPaymentResponse(response.paymentResponse ? response.paymentResponse : null);
    this.paymentService.setResultPayPolicy(paymentResponse);
  }

  setError(error): TransactionDto {
    return {
      transactionErrorCode: error.transactionErrorCode ? error.transactionErrorCode : '',
      transactionExternalKey: error.transactionErrorCode ? error.transactionExternalKey : '',
      transactionFingerKey: error.transactionErrorCode ? error.transactionFingerKey : '',
      transactionLogId: error.transactionErrorCode ? error.transactionLogId : '',
      transactionMessage: error.transactionErrorCode ? error.transactionMessage : '',
      transactionStatusId: error.transactionErrorCode ? error.transactionStatusId : '',
      transactionUrl: error.transactionErrorCode ? error.transactionUrl : '',
      payment: error.transactionErrorCode ? error.payment : '',
      transactionMode: 2
    };
  }

  checkIfPaymentWasGenerated(transaction: TransactionResponseDto) {
    return (transaction && transaction.payment && transaction.transactionStatusId === 1);
  }

  getQueryParams() {
    this.activeRouter.queryParams.subscribe(params => {
      this.id = params['id'];
      this.resourcePath = params['resourcePath'];
    });
  }

  getParams() {
    this.activeRouter.params.subscribe(params => {
      this.policyId = +params['policyId'];
      this.transactionLogId = params['transactionLogId'];
    });
  }

}
