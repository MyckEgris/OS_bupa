import { TestBed, inject } from '@angular/core/testing';

import { PolicyApplicationService } from './policy-application.service';

describe('.\services\policyApplication\policyApplicationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PolicyApplicationService]
    });
  });

  it('should be created', inject([PolicyApplicationService],
    (service: PolicyApplicationService) => {
    expect(service).toBeTruthy();
  }));
});
