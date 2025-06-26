import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IdleUserComponent } from './idle-user.component';

describe('IdleUserComponent', () => {
  let component: IdleUserComponent;
  let fixture: ComponentFixture<IdleUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IdleUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IdleUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
