import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationAddMembersComponent } from './quotation-add-members.component';

describe('QuotationAddMembersComponent', () => {
  let component: QuotationAddMembersComponent;
  let fixture: ComponentFixture<QuotationAddMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationAddMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationAddMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
