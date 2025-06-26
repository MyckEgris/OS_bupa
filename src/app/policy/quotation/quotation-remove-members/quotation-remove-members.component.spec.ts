import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationRemoveMembersComponent } from './quotation-remove-members.component';

describe('QuotationRemoveMembersComponent', () => {
  let component: QuotationRemoveMembersComponent;
  let fixture: ComponentFixture<QuotationRemoveMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationRemoveMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationRemoveMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
