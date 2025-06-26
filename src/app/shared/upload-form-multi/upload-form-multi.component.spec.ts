import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFormMultiComponent } from './upload-form-multi.component';

describe('UploadFormMultiComponent', () => {
  let component: UploadFormMultiComponent;
  let fixture: ComponentFixture<UploadFormMultiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadFormMultiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadFormMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
