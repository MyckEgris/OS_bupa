import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicFormsBuildComponent } from './dynamic-forms-build.component';

describe('DynamicFormsBuildComponent', () => {
  let component: DynamicFormsBuildComponent;
  let fixture: ComponentFixture<DynamicFormsBuildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicFormsBuildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicFormsBuildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
