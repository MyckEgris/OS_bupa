import { TestBed, inject } from '@angular/core/testing';
import { ClaimSubmissionWizardService } from './claim-submission-wizard.service';



describe('ClaimSubmissionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClaimSubmissionWizardService]
    });
  });

  it('should be created', inject([ClaimSubmissionWizardService], (service: ClaimSubmissionWizardService) => {
    expect(service).toBeTruthy();
  }));
});
