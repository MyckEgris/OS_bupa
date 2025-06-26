import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationModifyDeductibleComponent } from './quotation-modify-deductible.component';

describe('QuotationModifyDeductibleComponent', () => {
  let component: QuotationModifyDeductibleComponent;
  let fixture: ComponentFixture<QuotationModifyDeductibleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationModifyDeductibleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationModifyDeductibleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
