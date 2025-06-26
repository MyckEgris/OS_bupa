import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCreditCardStepsComponent } from './payment-credit-card-steps.component';

describe('PaymentCreditCardStepsComponent', () => {
  let component: PaymentCreditCardStepsComponent;
  let fixture: ComponentFixture<PaymentCreditCardStepsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentCreditCardStepsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentCreditCardStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
