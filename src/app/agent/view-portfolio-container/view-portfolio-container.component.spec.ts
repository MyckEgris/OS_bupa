import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPortfolioContainerComponent } from './view-portfolio-container.component';

describe('ViewPortfolioContainerComponent', () => {
  let component: ViewPortfolioContainerComponent;
  let fixture: ComponentFixture<ViewPortfolioContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewPortfolioContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewPortfolioContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
