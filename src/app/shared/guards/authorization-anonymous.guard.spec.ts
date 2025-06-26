import { TestBed, async, inject } from '@angular/core/testing';

import { AuthorizationAnonymousGuard } from './authorization-anonymous.guard';

describe('AuthorizationAnonymousGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthorizationAnonymousGuard]
    });
  });

  it('should ...', inject([AuthorizationAnonymousGuard], (guard: AuthorizationAnonymousGuard) => {
    expect(guard).toBeTruthy();
  }));
});
