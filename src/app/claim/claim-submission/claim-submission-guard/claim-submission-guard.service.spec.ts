import { TestBed, inject } from '@angular/core/testing';

import { ClaimSubmissionGuardService } from './claim-submission-guard.service';

describe('ClaimSubmissionGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClaimSubmissionGuardService]
    });
  });

  it('should be created', inject([ClaimSubmissionGuardService], (service: ClaimSubmissionGuardService) => {
    expect(service).toBeTruthy();
  }));
});
