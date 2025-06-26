import { TestBed, inject } from '@angular/core/testing';

import { ProviderDetailService } from './provider-detail.service';

describe('ProviderDetailService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProviderDetailService]
    });
  });

  it('should be created', inject([ProviderDetailService], (service: ProviderDetailService) => {
    expect(service).toBeTruthy();
  }));
});
