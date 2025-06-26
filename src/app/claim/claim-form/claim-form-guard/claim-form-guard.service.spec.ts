import { TestBed, inject } from '@angular/core/testing';

import { ClaimFormGuardService } from './claim-form-guard.service';

describe('ClaimSubmissionGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClaimFormGuardService]
    });
  });

  it('should be created', inject([ClaimFormGuardService], (service: ClaimFormGuardService) => {
    expect(service).toBeTruthy();
  }));
});
