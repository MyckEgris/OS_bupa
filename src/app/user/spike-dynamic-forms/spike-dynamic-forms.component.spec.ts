import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpikeDynamicFormsComponent } from './spike-dynamic-forms.component';

describe('SpikeDynamicFormsComponent', () => {
  let component: SpikeDynamicFormsComponent;
  let fixture: ComponentFixture<SpikeDynamicFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpikeDynamicFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpikeDynamicFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
