import { TestBed, async, inject } from '@angular/core/testing';

import { DeactivateRouteGuard } from './deactivate-route.guard';

describe('DeactivateRouteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeactivateRouteGuard]
    });
  });

  it('should ...', inject([DeactivateRouteGuard], (guard: DeactivateRouteGuard) => {
    expect(guard).toBeTruthy();
  }));
});
