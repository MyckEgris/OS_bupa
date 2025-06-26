import { TestBed, async, inject } from '@angular/core/testing';

import { ValidateBusinessInsuranceGuard } from './validate-business-insurance.guard';

describe('ValidateBusinessInsuranceGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValidateBusinessInsuranceGuard]
    });
  });

  it('should ...', inject([ValidateBusinessInsuranceGuard], (guard: ValidateBusinessInsuranceGuard) => {
    expect(guard).toBeTruthy();
  }));
});
