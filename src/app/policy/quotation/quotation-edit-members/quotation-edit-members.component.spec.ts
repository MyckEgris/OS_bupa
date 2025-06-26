import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationEditMembersComponent } from './quotation-edit-members.component';

describe('QuotationEditMembersComponent', () => {
  let component: QuotationEditMembersComponent;
  let fixture: ComponentFixture<QuotationEditMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationEditMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationEditMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
