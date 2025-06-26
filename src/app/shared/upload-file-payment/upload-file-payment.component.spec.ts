import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFilePaymentComponent } from './upload-file-payment.component';

describe('UploadFilePaymentComponent', () => {
  let component: UploadFilePaymentComponent;
  let fixture: ComponentFixture<UploadFilePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFilePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFilePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
