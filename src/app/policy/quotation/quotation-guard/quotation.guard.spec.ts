import { TestBed, async, inject } from '@angular/core/testing';

import { QuotationGuard } from './quotation.guard';

describe('QuotationGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuotationGuard]
    });
  });

  it('should ...', inject([QuotationGuard], (guard: QuotationGuard) => {
    expect(guard).toBeTruthy();
  }));
});
