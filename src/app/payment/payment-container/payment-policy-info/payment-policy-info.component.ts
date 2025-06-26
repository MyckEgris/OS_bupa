import { Component, Input } from '@angular/core/';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';
import { Utilities } from 'src/app/shared/util/utilities';
import { InsuranceBusiness } from 'src/app/shared/classes/insuranceBusiness.enum';
import { PaymentService } from 'src/app/shared/services/payment/payment.service';

@Component({
  selector: 'app-payment-policy-info',
  templateUrl: './payment-policy-info.component.html'
})
export class PaymentPolicyInfoComponent implements OnInit {

  public showToPayMexicanPeso: boolean;
  public isMexico: boolean;
  isExchangeRateValid = true;

  constructor(
    private paymentService: PaymentService,
  ) { }
  @Input() policy: PolicyDto;
  ngOnInit() {
    this.showToPayMexicanPesos();
  }

  /**
   * Sets a color depending on the status of the policy
   * @param status status to confirm
   */
  setStatusClass(status: string) {
    return Utilities.getStatusClass(status);
  }

  showToPayMexicanPesos() {
    const insuranceBusinessAgent = this.paymentService.getBupaInserance(this.policy);
    this.isMexico = insuranceBusinessAgent === InsuranceBusiness.BUPA_MEXICO ? true : false;
    if (insuranceBusinessAgent === InsuranceBusiness.BUPA_MEXICO && this.policy && this.policy.fixedRate) {
      this.showToPayMexicanPeso = true;
    } else {
      this.isExchangeRateValid = this.policy.exchangeRate !== 1 ? true : false;
      this.showToPayMexicanPeso = false;
    }
  }

}
