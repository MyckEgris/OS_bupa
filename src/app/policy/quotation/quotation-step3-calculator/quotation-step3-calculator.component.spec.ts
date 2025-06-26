import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationStep3CalculatorComponent } from './quotation-step3-calculator.component';

describe('QuotationStep3CalculatorComponent', () => {
  let component: QuotationStep3CalculatorComponent;
  let fixture: ComponentFixture<QuotationStep3CalculatorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationStep3CalculatorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationStep3CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
