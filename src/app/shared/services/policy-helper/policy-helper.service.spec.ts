import { TestBed, inject } from '@angular/core/testing';

import { PolicyHelperService } from './policy-helper.service';

describe('PolicyHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PolicyHelperService]
    });
  });

  it('should be created', inject([PolicyHelperService], (service: PolicyHelperService) => {
    expect(service).toBeTruthy();
  }));
});
