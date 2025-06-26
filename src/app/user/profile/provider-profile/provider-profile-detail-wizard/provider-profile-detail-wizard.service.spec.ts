import { TestBed, inject } from '@angular/core/testing';

import { ProviderProfileDetailWizardService } from './provider-profile-detail-wizard.service';

describe('ProviderProfileDetailWizardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProviderProfileDetailWizardService]
    });
  });

  it('should be created', inject([ProviderProfileDetailWizardService], (service: ProviderProfileDetailWizardService) => {
    expect(service).toBeTruthy();
  }));
});
