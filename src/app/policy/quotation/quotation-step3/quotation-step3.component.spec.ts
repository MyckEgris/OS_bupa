import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationStep3Component } from './quotation-step3.component';

describe('QuotationStep3Component', () => {
  let component: QuotationStep3Component;
  let fixture: ComponentFixture<QuotationStep3Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationStep3Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationStep3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
