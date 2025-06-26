import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { PaymentResponseDto } from 'src/app/shared/services/payment/entities/paymentResponse.dto';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';

@Component({
  selector: 'app-payment-process-ok',
  templateUrl: './payment-process-ok.component.html'
})
export class PaymentProcessOkComponent implements OnInit {

  public policy: PolicyDto;
  public paymentResult: PaymentResponseDto;

  // paying agent
  public payingUser: string;

  // Payment Date.
  public sysdate = new Date();

  public user: any;

  /***
   *  Variable to store amount in currency local
   */
  public balance: number;
  public amountPaid: number;
  public premiumValue: number;

  /***
   * Variable to store amount in currency local
   */
  public balanceLocal: number;
  public amountPaidLocal: number;
  public premiumValueLocal: number;

  /**
   * Variables to show o hide amount in currency local or dolar
   */
  public showAmountMexicanPesos: Boolean = false;
  public showAmountUSD: Boolean = true;

  private idPolicy: number;

  public insurance: any;

  constructor(private activeRouter: ActivatedRoute,
    private paymentService: PaymentService,
    private authService: AuthService,
    private config: ConfigurationService,
    private router: Router) { }

  ngOnInit() {
    this.user = this.authService.getUser();
    this.insurance = this.user.bupa_insurance;
    this.payingUser = this.user.given_name;
    if (this.paymentService.getResultPayPolicy() != null) {
      this.activeRouter.params.subscribe(params => {
        this.idPolicy = +params['policyId'];
        this.policy = this.paymentService.getPolicyToPay(this.idPolicy);
        if (this.policy == null) {
          this.router.navigate(['policies/policy-payments']);
        } else {
          this.showInfoPaymentOk();
        }
      });
    } else {
      this.router.navigate(['policies/policy-payments']);
    }

  }

  /**
   * Show Information Payment Ok
   */
  showInfoPaymentOk() {
    this.setDolarInfoPayment();
    if (this.paymentService.getBupaInserance(this.policy) === InsuranceBusiness.BUPA_MEXICO) {
      this.setMexicanInfoPayment();
      if (this.policy.fixedRate) {
        this.showAmountUSD = false;
        this.showAmountMexicanPesos = true;
      } else {
        this.showAmountUSD = true;
        this.showAmountMexicanPesos = true;
      }
    } else {
      this.showAmountMexicanPesos = false;
      this.showAmountUSD = true;
    }
  }

  /***
   * Set information payment in dolar
   */
  setDolarInfoPayment() {
    this.paymentResult = this.paymentService.getResultPayPolicy();
    this.premiumValue = this.policy.amountUSDTotalToPay;
    this.amountPaid = this.paymentService.getAmountPaid();
    this.balance = this.premiumValue - this.amountPaid;
  }

  /***
   * Set information payment in Mexican pesos
   */
  setMexicanInfoPayment() {
    this.showAmountMexicanPesos = true;
    this.premiumValueLocal = this.premiumValue / this.policy.exchangeRate;
    this.amountPaidLocal = this.amountPaid / this.policy.exchangeRate;
    this.balanceLocal = this.balance / this.policy.exchangeRate;
  }

  goToBack() {
    if (this.user.is_anonymous) {
      this.authService.logoff();
      location.href = this.config.redirectUri;
    } else {
      this.router.navigate(['policies/policy-payments']);
    }
  }

}
