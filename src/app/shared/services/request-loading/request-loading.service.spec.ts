import { TestBed, inject } from '@angular/core/testing';

import { RequestLoadingService } from './request-loading.service';

describe('RequestLoadingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RequestLoadingService]
    });
  });

  it('should be created', inject([RequestLoadingService], (service: RequestLoadingService) => {
    expect(service).toBeTruthy();
  }));
});
