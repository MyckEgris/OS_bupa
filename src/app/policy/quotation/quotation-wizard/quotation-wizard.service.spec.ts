import { TestBed, inject } from '@angular/core/testing';

import { QuotationWizardService } from './quotation-wizard.service';

describe('QuotationWizardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuotationWizardService]
    });
  });

  it('should be created', inject([QuotationWizardService], (service: QuotationWizardService) => {
    expect(service).toBeTruthy();
  }));
});
