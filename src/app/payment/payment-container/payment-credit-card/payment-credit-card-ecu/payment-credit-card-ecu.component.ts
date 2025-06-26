import { Component, OnInit, Input } from '@angular/core';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { TransactionDto } from 'src/app/shared/services/policy/entities/transaction.dto';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { CachingService } from 'src/app/shared/services/caching/caching-service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { PolicyService } from 'src/app/shared/services/policy/policy.service';
import { NotificationService } from 'src/app/shared/services/notification/notification.service';

@Component({
  selector: 'app-payment-credit-card-ecu',
  templateUrl: './payment-credit-card-ecu.component.html'
})
export class PaymentCreditCardEcuComponent implements OnInit {

  @Input() policy: PolicyDto;
  public payurl: string;
  public creditCardTypes: string;
  public baseUrl: string;

  private PAYMENTS = 'payments';
  private PAYMENTS_ECU = 'payment-bank-result/ecu';
  private TRANSACTIONS = 'transactions';
  private ERROR_404 = 404;

  constructor(
    private paymentService: PaymentService,
    private auth: AuthService,
    private config: ConfigurationService,
    private policyService: PolicyService,
    private notification: NotificationService
  ) { }

  ngOnInit() {
    this.creditCardTypes = 'VISA MASTER AMEX DINERS DISCOVER';
    sessionStorage.setItem(this.config.KEY_POLICY, btoa(JSON.stringify(this.policy)));
    this.startTransaction();

  }

  startTransaction() {
    if (this.paymentService.validateCanMakePayment(this.policy)) {
      this.paymentService.startTransaction(this.paymentService.buildStartTransactionRequest(+this.auth.getUser(), this.policy))
      .subscribe(transactionResponse => {
        // tslint:disable-next-line: max-line-length
        this.baseUrl = `${this.config.returnUrl}/${this.PAYMENTS}/${this.PAYMENTS_ECU}/${this.policy.policyId}/${this.TRANSACTIONS}/${transactionResponse.transactionLogId}`;
        this.payurl = transactionResponse.transactionUrl;
      }, error => {
        if (this.checkIfNotData(error)) {
          this.notification.showDialog('EMPLOYEE.QUOTE.QUOTATION.CURRENT_INFORMATION.DATA_NOT_FOUND_TITLE',
                    'EMPLOYEE.QUOTE.QUOTATION.CURRENT_INFORMATION.DATA_NOT_FOUND_MESSAGE');
        }
      });
    }
  }

  checkIfNotData(error) {
    return (error.status === this.ERROR_404);
  }

}
