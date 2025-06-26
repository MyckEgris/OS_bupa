import { TestBed, inject } from '@angular/core/testing';

import { PolicyPaymentsService } from './policy-payments.service';

describe('PolicyPaymentsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PolicyPaymentsService]
    });
  });

  it('should be created', inject([PolicyPaymentsService], (service: PolicyPaymentsService) => {
    expect(service).toBeTruthy();
  }));
});
