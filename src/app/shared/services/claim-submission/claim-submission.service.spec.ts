import { TestBed, inject } from '@angular/core/testing';

import { ClaimSubmissionService } from './claim-submission.service';

describe('ClaimSubmissionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClaimSubmissionService]
    });
  });

  it('should be created', inject([ClaimSubmissionService], (service: ClaimSubmissionService) => {
    expect(service).toBeTruthy();
  }));
});
