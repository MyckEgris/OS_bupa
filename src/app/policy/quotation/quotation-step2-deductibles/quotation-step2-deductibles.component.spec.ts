import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationStep2DeductiblesComponent } from './quotation-step2-deductibles.component';

describe('QuotationStep2DeductiblesComponent', () => {
  let component: QuotationStep2DeductiblesComponent;
  let fixture: ComponentFixture<QuotationStep2DeductiblesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationStep2DeductiblesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationStep2DeductiblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
