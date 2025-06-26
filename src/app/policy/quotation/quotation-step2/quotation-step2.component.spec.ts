import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationStep2Component } from './quotation-step2.component';

describe('QuotationStep2Component', () => {
  let component: QuotationStep2Component;
  let fixture: ComponentFixture<QuotationStep2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationStep2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationStep2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
