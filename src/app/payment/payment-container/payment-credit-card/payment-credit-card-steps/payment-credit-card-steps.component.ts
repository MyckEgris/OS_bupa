import { Component, OnInit, Input } from '@angular/core';
import { PolicyDto } from 'src/app/shared/services/policy/entities/policy.dto';

@Component({
  selector: 'app-payment-credit-card-steps',
  templateUrl: './payment-credit-card-steps.component.html'
})
export class PaymentCreditCardStepsComponent implements OnInit {

  public policy: PolicyDto;
  @Input() currentStep: number;
  constructor() { }

  ngOnInit() {
  }

}
