import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogFormMultiComponent } from './dialog-form-multi.component';

describe('DialogFormMultiComponent', () => {
  let component: DialogFormMultiComponent;
  let fixture: ComponentFixture<DialogFormMultiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogFormMultiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogFormMultiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
