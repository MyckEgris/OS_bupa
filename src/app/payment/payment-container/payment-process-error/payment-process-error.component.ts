import { Component, OnInit } from '@angular/core';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { TransactionDto } from 'src/app/shared/services/payment/entities/transaction.dto';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { UserInformationModel } from 'src/app/security/model/user-information.model';
import { Router } from '@angular/router';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';

@Component({
  selector: 'app-payment-process-error',
  templateUrl: './payment-process-error.component.html'
})
export class PaymentProcessErrorComponent implements OnInit {

  public error: TransactionDto;
  public user: UserInformationModel;
  public insurance: any;

  constructor(
    private paymentService: PaymentService,
    private auth: AuthService,
    private router: Router,
    private config: ConfigurationService
  ) { }

  ngOnInit() {
    this.user = this.auth.getUser();
    this.insurance = this.user.bupa_insurance;
    this.error = this.paymentService.getErrorPayPolicy();
  }

  goToBack() {
    if (this.user.is_anonymous) {
      this.auth.logoff();
      location.href = this.config.redirectUri;
    } else {
      this.router.navigate(['policies/policy-payments']);
    }
  }

}
