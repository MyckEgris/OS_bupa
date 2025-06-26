import { TestBed, inject } from '@angular/core/testing';
import { ClaimFormWizardService } from './claim-form-wizard.service';



describe('ClaimSubmissionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClaimFormWizardService]
    });
  });

  it('should be created', inject([ClaimFormWizardService], (service: ClaimFormWizardService) => {
    expect(service).toBeTruthy();
  }));
});
