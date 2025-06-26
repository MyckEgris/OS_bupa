import { Component } from '@angular/core';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';
import { ConfigurationService } from 'src/app/shared/services/configuration/configuration.service';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { AuthService } from 'src/app/security/services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';

@Component({
  selector: 'app-payment-container',
  templateUrl: './payment-container.component.html'
})
export class PaymentContainerComponent implements OnInit {

  // Object Policy search
  public policy: PolicyDto;

  // Id that comes from the previous tab to consult the policy.
  private idPolicy: number = null;

  // flags for show tabs
  public showCC = false;
  public showCheque = false;
  public showWT = false;
  public isMexico = false;

  public startInactivityMxPortal: Date;
  public endInactivityMxPortal: Date;
  public today: Date;
  

  constructor(
    
    private paymentService: PaymentService,
    private _config: ConfigurationService,
    private router: Router,
    private activeRouter: ActivatedRoute
  
  ) { 

    this.today = new Date();
    this.startInactivityMxPortal = new Date(this._config.inactivityMXPortal.split('|')[0]);
    this.endInactivityMxPortal = new Date(this._config.inactivityMXPortal.split('|')[1]);
    
  }
    
  

  

  // capture policy Id parameter in search policy by id.
  ngOnInit() {

    this.whichIsBupaInserance();
    this.activeRouter.params.subscribe(params => {
      this.idPolicy = +params['policyId'];
      this.policy = this.paymentService.getPolicyToPay(this.idPolicy);
      if (this.policy == null) {
        this.router.navigate(['policies/policy-payments']);
      } else {
        const bupaInsurance = this.paymentService.getBupaInserance(this.policy);
        this.displayTabs(this._config.getPaymentMethodTypes(bupaInsurance));
      }
    }, error => {
      this.handlePolicyError(error);
    });
  }

  // In case of error in search policy, navigate to policiy payments
  private handlePolicyError(error: any) {
    if (error.error.code) {
      this.router.navigate(['policies/policy-payments']);
    }
  }

  // Enabled tabs depending payments types permitted
  displayTabs(paymentTypes: string[]) {
    if (paymentTypes.indexOf('CC') > -1) { this.showCC = true; }
    if (paymentTypes.indexOf('Cheque') > -1) { this.showCheque = true; }
    // if (paymentTypes.indexOf('WT') > -1) { this.showWT = true; }
  }

  whichIsBupaInserance() {
    const insuranceBusinessAgent = this.paymentService.getBupaInserance(this.policy);
    if (insuranceBusinessAgent === InsuranceBusiness.BUPA_MEXICO) {
      this.isMexico = true;
    }
  }
  inactivityPeriod(): Boolean {
    //console.log("Start: " + this.startInactivityMxPortal + " End: " + this.endInactivityMxPortal + " Hoy es: " + this.today);
    return (this.startInactivityMxPortal < this.today) && (this.today < this.endInactivityMxPortal)
  }
}
