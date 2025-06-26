import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationStep1Component } from './quotation-step1.component';

describe('QuotationStep1Component', () => {
  let component: QuotationStep1Component;
  let fixture: ComponentFixture<QuotationStep1Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationStep1Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationStep1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
